

const { id } = require('date-fns/locale')
const userSchema = require( '../models/userModel')
const categorySchema = require( '../models/categoryModel')
const productSchema = require( '../models/productModel' )
const { log } = require('util')


module.exports = {

    getCategory : async ( req, res ) => {

        try {

            const category = await categorySchema.find()
            
            res.render( 'admin/category', {
                admin : req.session.admin,
                category : category

            } )

        } catch (error) {
            console.log(error.message);
        }

    },

    addCategory : async ( req, res ) => {

        try {

            const category = await categorySchema.findOne( { category : req.body.category })

            if( category ) {
                res.redirect( '/admin/category')
            } else {

                const categoryName = new categorySchema({

                    category : req.body.category
                })

                const result = await categoryName.save()
                res.redirect('/admin/category')
            }
            
        } catch (error) {
            console.log(error.message);
        }

    },
    
    listCategory : async ( req, res ) => {

        const list = await categorySchema.updateOne({ _id : req.params.id }, { $set : { status : true } })
        
        res.redirect('/admin/category')

    },

    unlistCategory : async ( req, res ) => {

        try {

            const unlist = await categorySchema.updateOne({ _id : req.params.id },{ $set : { status : false}})

            res.redirect('/admin/category')
            
        } catch (error) {
            console.log(error.message);
        }

    },

    getEditCategory : async ( req, res ) => {

        try {
            
            const category = await categorySchema.findOne({ _id : req.params.id })

            console.log(category);
            res.render('admin/edit-category',{
                admin : req.session.admin,
                value : category.category
            })

        } catch (error) {
            console.log(error.message);
        }
    },
}