
const productSchema = require('../models/productModel')


module.exports = {

    // Home page GET
    getHome : async( req, res ) => {

        const products = await productSchema.find({status : true})
        console.log(products);

        res.render( 'shop/home',{
            products : products
        } )

    },

    // Shop page GET
    getShop : ( req, res ) => {
        res.render('shop/shop')
    }

}