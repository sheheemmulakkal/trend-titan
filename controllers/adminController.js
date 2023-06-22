
const { id } = require('date-fns/locale')
const userSchema = require( '../models/userModel')

module.exports = {

    getAdminHome : ( req, res ) => {

        res.render( 'admin/dashboard' )
    },

    getUserList : async( req, res ) => {

        const userList = await userSchema.find( {isAdmin : 0} )

        // console.log(userList);

        res.render( 'admin/userList', {userList : userList} )

    },

    blockUser : async ( req, res ) => {


        try {

            const userId = req.params.id
            const userData = await userSchema.findById(userId)
            
            const block = await userData.updateOne({ $set : {isBlocked : true}})

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