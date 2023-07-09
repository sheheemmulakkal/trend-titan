

const userSchema = require( '../models/userModel' )
const paginationHelper = require( '../helpers/paginationHelper' )




module.exports = {

    getAdminHome : ( req, res ) => {

        try {
            res.render( 'admin/dashboard', {
                admin : req.session.admin
            } )
        } catch (error) {
            console.log(error.message);
        }
        
    },

    getUserList : async( req, res ) => {

        try {
            let page = Number(req.query.page);
            if (isNaN(page) || page < 1) {
            page = 1;
            }
            const userCount = await userSchema.find({ isAdmin : 0 }).count()
            const userList = await userSchema.find({ isAdmin : 0 })
            .skip(( page - 1 ) * paginationHelper.USERS_PER_PAGE ).limit( paginationHelper.USERS_PER_PAGE )

            res.render( 'admin/userList', {
                userList : userList,
                admin : req.session.admin,
                currentPage : page,
                hasNextPage : page * paginationHelper.USERS_PER_PAGE < userCount,
                hasPrevPage : page > 1,
                nextPage : page + 1,
                prevPage : page -1,
                lastPage : Math.ceil( userCount / paginationHelper.USERS_PER_PAGE ) 
            } )
            
        } catch (error) {
            console.log(error.message);
        }

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