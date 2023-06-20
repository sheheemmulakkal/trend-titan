const userSchema = require( '../models/userModel') 
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

            if( userData && userData.isAdmin !== 1 ) {

                const password = await bcrypt.compare( req.body.password, userData.password)


                if( password ) {
                    res.redirect( '/' )

                } else {
                    res.render( 'auth/userLogin', {
                        err: 'Incorrect Password'
                    } )
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

                const result = await user.save()

                res.redirect( '/' )

            }

        }catch( err ) {
            console.log(err.message);
        }
    } 

}