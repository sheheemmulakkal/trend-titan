
const { id } = require('date-fns/locale')
const userSchema = require( '../models/userModel')
const categorySchema = require( '../models/categoryModel')
const productSchema = require( '../models/productModel' )
const { log } = require('util')

module.exports = {

    getAddProducts : async ( req, res ) => {
        try {

            const categories = await categorySchema.find({status:true})
            
            res.render( 'admin/add-products',{
                admin : req.session.admin,
                categories : categories
            } )

        } catch (error) {
            console.log(error.message);
        }
    },

    addProducts : async ( req, res ) => {
        try {

            const img = []
            for( let items of req.files) {
                img.push(items.filename)
            }

            console.log(img);
            const product = new productSchema( {
                name : req.body.name,
                description : req.body.description,
                brand : req.body.brand,
                image : img,
                category : req.body.id,
                quantity : req.body.quantity,
                price : req.body.price
            })

            const result = await product.save()
            // console.log(result);
            res.redirect('/admin/add-products')

        } catch(error){
            console.log(error.message);
        }
    },
 
    getProductsList : async( req, res ) => {

        try {

            const products = await productSchema.find().populate('category')
            // console.log(products)

            res.render('admin/products',{
                admin : req.session.admin,
                
                products : products
            })

        } catch (error) { 
            console.log(error.message);
        }

    },

    deleteProduct : async( req, res ) => {

        try {

            const product = await productSchema.updateOne({ _id : req.params.id},{ $set :{ status : false}})
            res.redirect('/admin/products')
            
        } catch (error) {
            console.log(error.message);
        }
    },

    restoreProduct : async( req, res ) => {

        try {

            const product = await productSchema.updateOne({ _id : req.params.id},{ $set :{ status : true}})
            res.redirect('/admin/products')
            
        } catch (error) {
            console.log(error.message);
        }
    }

}