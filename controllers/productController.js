
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
            
            const product = new productSchema( {
                name : req.body.name,
                description : req.body.description,
                brand : req.body.brand,
                category : req.body.id,
                quantity : req.body.quantity,
                price : req.body.price
            })

            const result = await product.save()
            console.log(result);
            res.redirect('/admin/add-products')

        } catch(error){
            console.log(error.message);
        }
    },
 
    getProductsList : async( req, res ) => {

        try {

            // const products = await productSchema.find()
            const products = await productSchema.find().populate('category')
            // console.log(categories);

            
            res.render('admin/products',{
                admin : req.session.admin,
                products : products
            })

        } catch (error) {
            console.log(error.message);
        }

        
    }

}