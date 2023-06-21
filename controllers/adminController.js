
const userSchema = require( '../models/userModel')

module.exports = {

    getAdminHome : ( req, res ) => {

        res.render( 'admin/dashboard' )
    },

    getUserList : async( req, res ) => {

        const userList = await userSchema.find( {isAdmin : 0} )

        console.log(userList);

        res.render( 'admin/userList', {userList : userList} )

    }



}