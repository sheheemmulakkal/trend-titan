
const productSchema = require('../models/productModel')
const categorySchema = require( '../models/categoryModel')
const bannerSchema = require( '../models/bannerModel')


module.exports = {

    // Home page GET
    getHome : async( req, res ) => {

        try {

            const banners = await bannerSchema.find({status : true})
            const products = await productSchema.find({status : true})
            res.render( 'shop/home',{
                products : products,
                banners : banners
            } )
            
        } catch (error) {
            console.log(error.message);
        }
    },

    // Shop page GET
    getShop : async( req, res ) => {

        try {

            const products = await productSchema.find({status: true})
            const category = await categorySchema.find({status: true})
            const brands = await productSchema.distinct('brand')

            res.render('shop/shop',{
                products  : products,
                category : category,
                brands : brands
            })
              
        } catch (error) {
            console.log(error.message);
        }
    },

    // Single product GET
    getSingleProduct : async( req, res ) => {

        try {
            
            const product = await productSchema.find({_id : req.params.id, status : true }).populate('category')
            const related = await productSchema.find({status : true}).limit(4)
            res.render('shop/single-product',{
                product : product,
                related : related
            })

        } catch (error) {
            console.log(error.message);
        }

    }

}