

const fs = require( 'fs' )
const path = require( 'path' )
const categorySchema = require( '../models/categoryModel')
const productSchema = require( '../models/productModel' )
const paginationHelper = require( '../helpers/paginationHelper' )



module.exports = {

    getAddProducts : async ( req, res ) => {
        try {
            const categories = await categorySchema.find({status:true})
            res.render( 'admin/add-products',{
                admin : req.session.admin,
                categories : categories,
                err : req.flash('err')
            } )
        } catch (error) {
            console.log(error.message);
        }
    },

    addProducts : async ( req, res ) => {
        try {
            for(let file of req.files) {
                if( 
                    file.mimetype !== 'image/jpg' &&
                    file.mimetype !== 'image/jpeg' &&
                    file.mimetype !== 'image/png' &&
                    file.mimetype !== 'image/gif'
                    ){
                        req.flash('err','Check the image type')
                        return res.redirect('/admin/add-products')
                    }
            }
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
            await product.save()
            res.redirect('/admin/products')
        } catch(error){
            console.log(error.message);
        }
    },
 
    getProductsList : async( req, res ) => {
        try {
            const { search, sortData, sortOrder } = req.query
            let page = Number(req.query.page);
            if (isNaN(page) || page < 1) {
            page = 1;
            }
            const sort = {}
            const condition = {}
            if( sortData ) {
                if( sortOrder === "Ascending" ){
                    sort[sortData] = 1
                } else {
                    sort[sortData] = -1
                }
            }
            if ( search ){
                condition.$or = [
                    { name : { $regex : search, $options : "i" }},
                    { brand : { $regex : search, $options : "i" }},
                    { description : { $regex : search, $options : "i" }},  
                ]
            }
            const productsCount = await productSchema.find( condition ).count()
            const products = await productSchema.find( condition ).populate( 'category' )
            .sort( sort ).skip(( page - 1 ) * paginationHelper.PRODUCT_PER_PAGE ).limit( paginationHelper.PRODUCT_PER_PAGE )
            res.render('admin/products',{
                admin : req.session.admin,
                products : products,
                currentPage : page,
                hasNextPage : page * paginationHelper.PRODUCT_PER_PAGE < productsCount,
                hasPrevPage : page > 1,
                nextPage : page + 1,
                prevPage : page -1,
                lastPage : Math.ceil( productsCount / paginationHelper.PRODUCT_PER_PAGE ),
                search : search,
                sortData : sortData,
                sortOrder : sortOrder
            })

        } catch ( error ) { 
            console.log( error.message );
        }

    },

    deleteProduct : async( req, res ) => {
        try {
            await productSchema.updateOne({ _id : req.params.id },{ $set :{ status : false}})
            res.redirect('/admin/products')
        } catch ( error ) {
            console.log( error.message );
        }
    },

    restoreProduct : async( req, res ) => {
        try {
            await productSchema.updateOne({ _id : req.params.id },{ $set :{ status : true } })
            res.redirect( '/admin/products' )
        } catch ( error ) {
            console.log( error.message );
        }
    },

    getEditProdut : async( req, res ) => {
        try {
            const product = await productSchema.findOne({ _id : req.params.id }).populate( 'category' )
            const category = await categorySchema.find()
            res.render( 'admin/edit-products', {
                product : product,
                categories : category,
                admin : req.session.admin,
                err : req.flash( 'err' )
            } )
        } catch ( error ) {
            console.log( error.message );
        }
    },

    deleteImage : async ( req, res ) => {
        try {
            const id = req.query.id
            const image = req.query.imageId
            await productSchema.updateOne({ _id : id },{ $pull : { image : image }})
            fs.unlink( path.join( __dirname, '../public/images/product-images/' ) + image , ( err ) => {
                if( err ) {
                   console.log( err.message );
                }
            })
            res.redirect(`/admin/edit-product/${id}`)
        } catch ( error ) {
            console.log( error.message );
        }
    },

    editProduct : async( req, res ) => {
        try {
            const existingProduct = await productSchema.findById( req.body.productId )
            if( req.files ) {
                for( let file of req.files ) {
                    if( 
                        file.mimetype !== 'image/jpg' &&
                        file.mimetype !== 'image/jpeg' &&
                        file.mimetype !== 'image/png' &&
                        file.mimetype !== 'image/gif'
                        ){
                            req.flash( 'err','Check the image type' )
                            return res.redirect(`/admin/edit-product/${existingProduct._id}`)
                        }
                }
                const images = existingProduct.image
                req.files.forEach( element => {
                    images.push( element.filename )
                });
                var img = images
            }
            await productSchema.updateOne( { _id : req.body.productId },
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
            res.redirect( '/admin/products' )
        } catch ( error ) {
            console.log( error.message );
        }
    }
}