
module.exports = {
    get404 : ( req, res ) => {
        res.render( 'error/404' )
    },
    get500 : ( req, res ) => {
        res.render( 'error/500' )
    }


}