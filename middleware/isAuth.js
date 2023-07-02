module.exports = {
    
    userAuth : ( req, res, next ) => {

        if( !req.session.user ) {
            return res.redirect( '/login' ) 
        }
        next()
    },

    adminAuth : ( req, res, next ) => {

        if( !req.session.admin ) {
           return res.redirect( '/admin/login')
        }

        next()
    },

    userLoggedout : ( req, res, next ) => {

        if( req.session.user ) {
            return res.redirect( '/' ) 
        }

        next()
    },

    adminLoggedOut : (req, res, next ) => {

        if( req.session.admin ) {
            return res.redirect( '/admin' )
        }

        next()
    }

}