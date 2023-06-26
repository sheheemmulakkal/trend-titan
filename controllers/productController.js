
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
            res.redirect('/admin/add-products')

        } catch(error){
            console.log(error.message);
        }
    },
 
    getProductsList : async( req, res ) => {

        try {

            const products = await productSchema.find().populate('category')
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

            const product = await productSchema.updateOne({ _id : req.params.id },{ $set :{ status : false}})
            res.redirect('/admin/products')
            
        } catch (error) {
            console.log(error.message);
        }
    },

    restoreProduct : async( req, res ) => {

        try {

            const product = await productSchema.updateOne({ _id : req.params.id },{ $set :{ status : true} })
            res.redirect('/admin/products')
            
        } catch (error) {
            console.log(error.message);
        }
    },

    getEditProdut : async( req, res ) => {

        const product = await productSchema.findOne({ _id : req.params.id }).populate('category')
        const category = await categorySchema.find()

        res.render( 'admin/edit-products', {
            product : product,
            categories : category,
            admin : req.session.admin
        } )

    },



    deleteImage : async ( req, res ) => {
        try {

            const id = req.query.id
            const image = req.query.imageId
            const deleteImage = await productSchema.updateOne({_id : id},{ $pull : {image : image}})


            res.redirect(`/admin/edit-product/${id}`)
            
        } catch (error) {
            console.log(error.message);
        }
    },

    editProduct : async( req, res ) => {

        try {

            if( req.files ) {
                const existingProduct = await productSchema.findById(req.body.productId)
                const images = existingProduct.image
                req.files.forEach(element => {
                    images.push(element.filename)
                });
                var img = images
            }
    
            const update = await productSchema.updateOne( {_id : req.body.productId},
                {
                    $set : {
                        name : req.body.name,
                        description : req.body.description,
                        brand : req.body.brand,
                        category : req.body.id,
                        quantity : req.body.quantity,
                        price : req.body.price,
                        image : img
                    }
                })
    
            res.redirect( '/admin/products')
            
        } catch (error) {
            console.log(error.message);
        }
    }



}