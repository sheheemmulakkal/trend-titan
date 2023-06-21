module.exports = {
    
    userAuth : ( req, res, next ) => {

        if( !req.session.isLoggedin ) {
            return res.redirect( '/login' ) 
        }

        next()
    },

    adminAuth : ( req, res, next ) => {

        if( !req.session.adminLoggedin ) {
           return res.redirect( '/admin/login')
        }

        next()
    },

    userLoggedout : ( req, res, next ) => {

        if( req.session.isLoggedin ) {
            return res.redirect( '/' ) 
        }

        next()
    },

    adminLoggedOut : (req, res, next ) => {

        if( req.session.adminLoggedin ) {
            return res.redirect( '/admin' )
        }

        next()
    }

}