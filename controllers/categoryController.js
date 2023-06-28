

const { id } = require('date-fns/locale')
const userSchema = require( '../models/userModel')
const categorySchema = require( '../models/categoryModel')
const productSchema = require( '../models/productModel' )
const { log } = require('util')
const { runInNewContext } = require('vm')


module.exports = {

    getCategory : async ( req, res ) => {

        try {
            const category = await categorySchema.find()
            res.render( 'admin/category', {
                admin : req.session.admin,
                category : category,
                err : req.flash('categoryExist'),
                success : req.flash('success')
            } )

        } catch (error) {
            console.log(error.message);
        }

    },
    
    addCategory : async ( req, res ) => {

        try {
            const cat = req.body.category.toUpperCase()
            const category = await categorySchema.findOne( { category : req.body.category.toUpperCase() })
            if( category ) {
                req.flash('categoryExist','Category already exist')
                res.redirect( '/admin/category')
            } else {
                const categoryName = new categorySchema({
                    category : req.body.category.toUpperCase()
                })
                const result = await categoryName.save()
                req.flash('success',`${cat} successfully added to category`)
                res.redirect('/admin/category')
            }
            
        } catch (error) {
            console.log(error.message);
        }

    },
    
    listCategory : async ( req, res ) => {

        try {
            const list = await categorySchema.updateOne({ _id : req.params.id }, { $set : { status : true } })
            res.redirect('/admin/category')
        } catch (error) {
            console.log(errror.message);
        }
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
                category : category
            })
        } catch (error) {
            console.log(error.message);
        }
    },

    editCategory : async ( req, res ) => {

        try {
            const update = await categorySchema.updateOne( { _id : req.body.categoryId },{
                category : req.body.category
            }) 
            res.redirect('/admin/category')
            
        } catch (error) {
            console.log(error.message);
        }
    }
}