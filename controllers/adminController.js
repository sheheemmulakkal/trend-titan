
const { id } = require('date-fns/locale')
const userSchema = require( '../models/userModel')
const categorySchema = require( '../models/categoryModel')
const productSchema = require( '../models/productModel' )
const { log } = require('util')

module.exports = {

    getAdminHome : ( req, res ) => {

        res.render( 'admin/dashboard', {
            admin : req.session.admin
        } )
    },

    getUserList : async( req, res ) => {

        const userList = await userSchema.find( {isAdmin : 0} )

        // console.log(userList);

        res.render( 'admin/userList', {
            userList : userList,
            admin : req.session.admin
        } )

    },

    blockUser : async ( req, res ) => {

        try {
            const userId = req.params.id
            console.log(userId,'user');
            const userData = await userSchema.findById(userId)
            const block = await userData.updateOne({ $set : {isBlocked : true}})

            // Destroying the session of user
            for (const sessionKey in req.sessionStore.sessions) {
                const sessionData = JSON.parse(req.sessionStore.sessions[sessionKey]);
                // Check if the session contains a user and it matches the user to block
                if (sessionData.user && sessionData.user === userId) {
                    console.log('session');
                  // Destroy the session
                  req.sessionStore.destroy(sessionKey, (error) => {
                    if (error) {
                      console.error('Error destroying session:', error);
                    }
                  });
                }
            }
            
            res.redirect( '/admin/userList' )
            
        } catch (error) {
            console.log(error.message);
        }
       
    },

    unBlockUser : async ( req, res ) => {
        try {
            
            const userId = req.params.id
            const userData = await userSchema.findById(userId)
            const unblock = await userData.updateOne({ $set : {isBlocked : false}})

            res.redirect( '/admin/userList' )

        } catch (error) {
            console.log(error.message);
        }
    }


}