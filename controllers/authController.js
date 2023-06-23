const userSchema = require( '../models/userModel') 
const bcrypt = require( 'bcryptjs' )
const nodemailer = require( 'nodemailer' )


const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : 'shaimonsheheem5@gmail.com',
        pass : 'gvyvfoagdfzrqtnh'
    }

});



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

                        req.session.user = userData
                        req.session.isLoggedin = true

                        

                        res.redirect( '/shop' )

                    } else {
                        res.render( 'auth/userLogin', {
                            err: 'Incorrect Password'
                        } )
                    }

                } else {

                    
                    const password = await bcrypt.compare( req.body.password, userData.password)

                    if( password ) {

                        res.render( 'auth/userLogin', {
                            err: 'Blocked user'
                        } )

                    } else {

                        res.render( 'auth/userLogin', {
                            err: 'Incorrect password'
                        } )

                    }
                }


                 

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

                
                const password = await bcrypt.hash( req.body.password, 12)

                const user = new userSchema( {
                    firstName : req.body.firstName,
                    lastName : req.body.lastName,
                    email : req.body.email,
                    mobile : req.body.mobile,
                    password : password
                })

                const userData = await user.save()

                    req.session.user = userData
                    req.session.isLoggedin = true

                    transporter.sendMail({
                        to : req.body.email,
                        from : 'shaimonsheheem5@gmail.com',
                        subject : 'Successfully registered',
                        html : ` <h1> hey ${req.body.lastName}, You successfully signed up!</h1>`
                    })

                res.redirect( '/shop' )

            }

        }catch( err ) {
            console.log(err.message);
        }
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