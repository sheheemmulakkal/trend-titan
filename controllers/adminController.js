

const userSchema = require( '../models/userModel')


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
            // console.log(userId,'user');
            const userData = await userSchema.findById(userId)
            await userData.updateOne({ $set : {isBlocked : true}})

            // Checks if the user is in same browser 
            if( req.session.user === userId ){
                // If user is in same browser it deletes 
                delete req.session.user
            }
            
            const sessions = req.sessionStore.sessions;
            for (const sessionId in sessions) {
            const session = JSON.parse(sessions[sessionId]);
            if (session.user === userId) {
                delete sessions[sessionId];
                break; 
            }
            }
            
            res.json( {success : true} )
            
        } catch (error) {
            console.log(error.message);
        }
       
    },

    unBlockUser : async ( req, res ) => {
        try {
            
            const userId = req.params.id
            const userData = await userSchema.findById(userId)
            await userData.updateOne({ $set : {isBlocked : false}})

            res.json( {success : true} )

        } catch (error) {
            console.log(error.message);
        }
    }


}