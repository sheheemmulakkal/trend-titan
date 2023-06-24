const userSchema = require( '../models/userModel') 
const verificationController = require( './verificationControllers')
const bcrypt = require( 'bcryptjs' )




module.exports = {

    // Getting user login page
    getUserLogin : ( req, res ) => {

        res.render( 'auth/userLogin', {
            err:false
        })

    },

    // User Loging in 
    doUserLogin : async ( req, res ) => {

        try {

            userData = await userSchema.findOne( { email : req.body.email } )
            console.log(userData);
            if( userData && userData.isAdmin !== 1 ) {

                // Checking is user is blocked
                    if( userData.isBlocked === false ) {
                    const password = await bcrypt.compare( req.body.password, userData.password)


                    if( password ) {

                        if( userData.isVerified ) {

                            req.session.user = userData
                            req.session.isLoggedin = true

                            res.redirect( '/shop' )

                        } else {
                            const newOtp = verificationController.sendEmail(req.body.email, req.body.lastName)
                            console.log(newOtp);

                            const otpUpdate = await userSchema.updateOne({email : req.body.email},{
                                $set :{ 'token.otp' : newOtp , 'token.generatedTime' : new Date()}
                            })
                            console.log(1);
                            console.log(otpUpdate);
                            req.session.unVerfiedMail = req.body.email

                            res.redirect( '/otp-verification')

                        }

                        // For Incorrect password

                    } else {
                        res.render( 'auth/userLogin', {
                            err: 'Incorrect Password'
                        } )
                    }

                } else {

                    
                    const password = await bcrypt.compare( req.body.password, userData.password)

                    if( password ) {

                        // If user is blocked

                        res.render( 'auth/userLogin', {
                            err: 'Blocked user'
                        } )

                    } else {

                        // FOr incorrect password 

                        res.render( 'auth/userLogin', {
                            err: 'Incorrect password'
                        } )

                    }
                }

                // Incorrect Username
            } else {

                res.render( 'auth/userLogin', {
                    err: 'Incorrect Username'
                } )

            }

        } catch ( err ) {
            console.log( err.message );
        }

    },

    // UserLogout
    doUserLogout : ( req, res ) => {

        req.session.destroy()
        res.redirect( '/login' )
    },
    

    // Getting user signup page
    getUserSignup : ( req, res ) => {

        res.render( 'auth/userSignup', {err:false})
    },

    // User Signing Up
    doUserSignup : async ( req, res ) => {

        try {

            const userData = await userSchema.findOne( {email : req.body.email} )
            
            if( userData ) {

                return res.render( 'auth/userSignup', {
                    err: "User already exist"
                })

            } else { 

                    

                    const otp = verificationController.sendEmail(req.body.email, req.body.lastName)

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

                const userData = await user.save()

                req.session.unVerfiedMail = req.body.email

                res.redirect( '/otp-verification' )

            }

        }catch( err ) {
            console.log(err.message);
        }
    },

    // Signup Verification

    signupVerification : async ( req,res ) => {

       try {

        const enterTime = new Date()

        // console.log(req.body);
        let { val1, val2, val3, val4, val5, val6 } = req.body
        userOtp = val1 + val2 + val3 + val4 + val5 + val6
        
        // console.log(req.session.unVerfiedMail);

        // Checking otp in database
        const otpCheck = await userSchema.findOne({email: req.session.unVerfiedMail, 'token.otp' : userOtp })

        // If Otp matched
        if( otpCheck ) { 

            //Calculating the expire of the OTP
            const timeDiff =  (new Date(enterTime) - otpCheck.token.generatedTime) / 1000 / 60
            if( timeDiff <= 60 ) {

                // If expiry time is valid setting isVerified as true
                const verify = await userSchema.updateOne({ email : otpCheck.email } , { $set : {isVerified : true} })

                req.session.user = otpCheck
                req.session.isLoggedin = true
                req.session.unVerfiedMail = null

               res.redirect('/shop')


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
        console.log(error.messge);
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

                    req.session.admin = adminData
                    req.session.adminLoggedin = true

                    console.log(req.session.admin);

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
            console.log(error.message);
        }

    },

    doAdminLogout : ( req, res ) => {

        req.session.destroy()
        res.redirect ( '/admin/login' )
    }

}