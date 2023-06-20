const userSchema = require( '../models/userModel') 
const bcrypt = require( 'bcrypt' )

module.exports = {

    // Getting user login page
    getUserLogin : ( req, res ) => {

        res.render( 'auth/userLogin' )

    },

    // Getting user signup page
    getUserSignup : ( req, res ) => {

        res.render( 'auth/userSignup', {err:false})
    },

    // User Signing Up
    doUserSignup : async( req, res ) => {

        try {

            console.log(req.body);

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