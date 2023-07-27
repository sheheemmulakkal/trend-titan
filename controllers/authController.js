const bcrypt = require( 'bcryptjs' )

const userSchema = require( '../models/userModel') 
const cartSchema = require( '../models/cartModel')
const verificationController = require( './verificationControllers')




module.exports = {

    // Getting user login page
    getUserLogin : ( req, res ) => {
        try {
            res.render( 'auth/userLogin', {
                err: req.flash('error')
            })
        } catch (error) {
            error.message
        }
        
    },

    // User Loging in 
    doUserLogin : async ( req, res ) => {

        try {
            userData = await userSchema.findOne( { email : req.body.email } )
            if( userData && userData.isAdmin !== 1 ) {
                // Checking is user is blocked
                    if( userData.isBlocked === false ) {
                    const password = await bcrypt.compare( req.body.password, userData.password)
                    if( password ) {
                        if( userData.isVerified ) {
                            req.session.user = userData._id
                            const cart = await cartSchema.findOne({userId : userData._id})
                            if( cart ){
                                req.session.productCount = cart.items.length
                            } else {
                                req.session.productCount = 0
                            }
                            res.redirect( '/shop' )
                        } else {
                            const newOtp = verificationController.sendEmail(req.body.email, req.body.lastName)
                            await userSchema.updateOne({email : req.body.email},{
                                $set :{ 'token.otp' : newOtp , 'token.generatedTime' : new Date()}
                            })
                            req.session.unVerfiedMail = req.body.email
                            res.redirect( '/otp-verification')
                        }
                        // For Incorrect password
                    } else {
                        req.flash('error', 'Incorrect Password')
                        res.redirect( '/login')
                    }
                } else {
                    const password = await bcrypt.compare( req.body.password, userData.password)
                    if( password ) {
                        // If user is blocked
                        req.flash('error','Blocked user')
                        res.redirect( '/login')
                    } else {
                        // FOr incorrect password 
                        req.flash('error', 'Incorrect Password')
                        res.redirect( '/login')
                    }
                }
            } else {
                // Incorrect Username
                req.flash('error', 'Incorrect email')
                res.redirect( '/login' )
            }

        } catch ( err ) {
            res.redirect('/500')

        }

    },

    // UserLogout
    doUserLogout : ( req, res ) => {

        try {
            req.session.user = null
            res.redirect( '/login' )
        } catch (error) {
            res.redirect('/500')

        }
    },
    

    // Getting user signup page
    getUserSignup : ( req, res ) => {
        const { referral } = req.query
        res.render( 'auth/userSignup', { err: req.flash( 'userExist' ), referral : referral})
    },

    // User Signing Up
    doUserSignup : async ( req, res ) => {

        try {
            const { referral } = req.body
            
            // Checking is there any existing user
            const userData = await userSchema.findOne({ email : req.body.email })
            
            // If existing user
            if( userData ) {

                req.flash( 'userExist', 'User already exist...' )
                return res.redirect( '/signup' )

            } else { 

                    const otp = verificationController.sendEmail(req.body.email)    
                    const password = await bcrypt.hash( req.body.password, 12)
                    const user = new userSchema( {
                        firstName : req.body.firstName,
                        lastName : req.body.lastName,
                        email : req.body.email,
                        mobile : req.body.mobile,
                        password : password,
                        token : {
                            otp : otp,
                            generatedTime : new Date()
                        }
                    })
                await user.save()
                if( referral ) {
                    await userSchema.updateOne({ email : req.body.email },{
                        $set : {
                            isReferred : referral
                        }
                    }) 
                }
                req.session.unVerfiedMail = req.body.email
                res.redirect( '/otp-verification' )

            }

        }catch( err ) {
           res.redirect('/500')
        }
    },

    // Signup Verification

    signupVerification : async ( req,res ) => {

       try {
        const enterTime = new Date()
        let { val1, val2, val3, val4, val5, val6 } = req.body
        userOtp = val1 + val2 + val3 + val4 + val5 + val6

        // Checking otp in database
        const otpCheck = await userSchema.findOne({email: req.session.unVerfiedMail, 'token.otp' : userOtp })

        // If Otp matched
        if( otpCheck ) { 

            //Calculating the expire of the OTP
            const timeDiff =  (new Date(enterTime) - otpCheck.token.generatedTime) / 1000 / 60
            if( timeDiff <= 60 ) {
                const referralCode = verificationController.referralCodeGenerator()
                // If expiry time is valid setting isVerified as true
                await userSchema.updateOne({ email : otpCheck.email } , { $set :
                    {
                        isVerified : true,
                        referralCode : referralCode
                    }
                })
                if( otpCheck.isReferred ) {
                    await userSchema.updateOne({ referralCode : otpCheck.isReferred },{
                        $inc : {
                            wallet : 40
                        },
                        $push : {
                            walletHistory : {
                                date : Date.now(),
                                amount : 40,
                                message : 'Referral bonus'
                            }
                        }
                    })
                    await userSchema.updateOne({ _id : otpCheck._id },{
                        $inc : {
                            wallet : 100
                        },
                        $push : {
                            walletHistory : {
                                date : Date.now(),
                                amount : 100,
                                message : 'Join bonus'
                            }
                        }
                    })
                }
                req.session.user = otpCheck._id
                req.session.unVerfiedMail = null
                res.redirect('/shop')

               // If TimedOut
            } else {
                console.log( 'timout' );
                res.redirect( '/otp-verification' )
            }

            // If not OTP in database
        } else {
            console.log( 'otp not matched' );
            res.redirect( '/otp-verification' )
        }
        
       } catch ( error ) {
        res.redirect('/500')

       }

    },

    //Signup OTP verification page getting
    getSignupOtp : ( req, res ) => {
        res.render('auth/signup-otp')
    },

    // Getting admin login page
    getAdminLogin :  ( req, res ) => {
        res.render ( 'auth/adminLogin', {
            err : false
        })
    },

    // Admin loging in 
    doAdminLogin : async ( req, res ) => {

        try {
            const adminData = await userSchema.findOne( { email : req.body.email } )
            if( adminData && adminData.isAdmin == 1 ) {
                const password = await bcrypt.compare( req.body.password, adminData.password )

                if( password ) {
                    req.session.admin = adminData._id
                    res.redirect( '/admin' )

                } else {
                    res.render('auth/adminLogin', {
                        err : 'Incorrect Password'
                    })
                }

            } else {
                res.render( 'auth/adminLogin', {
                    err: 'Incorrect Email'
                } )
            }

        } catch ( error ) {
            res.redirect('/500')

        }

    },

    doAdminLogout : ( req, res ) => {

        try {
            req.session.admin = null
            res.redirect ( '/admin/login' )
        } catch (error) {
            res.redirect('/500')

        }
    },

    getForgotPassword : ( req, res ) => {
        
        res.render('auth/forgot-password',{
            err: req.flash('existErr')
        })
    },

    forgotPassword : async( req, res ) => {
        try {
            const emialExist = await userSchema.findOne( {email : req.body.email })
            if( emialExist ){
                const newOtp = verificationController.sendEmail(req.body.email, req.body.lastName)
                await userSchema.updateOne({email : req.body.email},{
                    $set :{ 'token.otp' : newOtp , 'token.generatedTime' : new Date()}
                })
                req.session.unVerfiedMail = req.body.email
                res.render('auth/forgot-password-otp')
            } else {
                req.flash('existErr','Mail not exist')
                res.redirect('/forgot-password')
            }
        } catch (error) {
            res.redirect('/500')

        }
    },

    forgotPasswordOtpVerification : async( req, res ) => {
        try {

            const enterTime = new Date()
            let { val1, val2, val3, val4, val5, val6 } = req.body
            userOtp = val1 + val2 + val3 + val4 + val5 + val6
    
            // Checking otp in database
            const otpCheck = await userSchema.findOne({email: req.session.unVerfiedMail, 'token.otp' : userOtp })
    
            // If Otp matched
            if( otpCheck ) { 
    
                //Calculating the expire of the OTP
                const timeDiff =  (new Date(enterTime) - otpCheck.token.generatedTime) / 1000 / 60
                if( timeDiff <= 60 ) {
                    console.log('otp matched');
                    // If expiry time is valid setting isVerified as true
                    res.render('auth/passwordReEnter',{
                        err : req.flash('err')
                    })
                   // If TimedOut
                } else {
                    console.log('timout');
                    res.redirect( '/otp-verification' )
                }
    
                // If not OTP in database
            } else {
                console.log('otp not matched');
                res.redirect('/otp-verification')
            }
            
           } catch (error) {
            res.redirect('/500')

           }
    },

    newPassword : async ( req, res ) => {
        try {
            const password = await bcrypt.hash( req.body.password, 12)
            await userSchema.findOneAndUpdate( { email : req.session.unVerfiedMail, isBlocked : false },
                { $set : {
                    password : password
                }})
            res.redirect('/login')
        } catch (error) {
            res.redirect('/500')
        }
    }

}