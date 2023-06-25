
const { id } = require('date-fns/locale')
const userSchema = require( '../models/userModel')
const categorySchema = require( '../models/categoryModel')

module.exports = {

    getAdminHome : ( req, res ) => {

        res.render( 'admin/dashboard', {
            admin : req.session.admin
        } )
    },

    getUserList : async( req, res ) => {

        const userList = await userSchema.find( {isAdmin : 0} )

        // console.log(userList);

        res.render( 'admin/userList', {
            userList : userList,
            admin : req.session.admin
        } )

    },

    blockUser : async ( req, res ) => {


        try {

            const userId = req.params.id
            const userData = await userSchema.findById(userId)
            
            const block = await userData.updateOne({ $set : {isBlocked : true}})

            res.redirect( '/admin/userList' )
            
        } catch (error) {
            console.log(error.message);
        }
       
    },

    unBlockUser : async ( req, res ) => {
        try {
            
            const userId = req.params.id
            const userData = await userSchema.findById(userId)

            const unblock = await userData.updateOne({ $set : {isBlocked : false}})

            res.redirect( '/admin/userList' )

        } catch (error) {
            console.log(error.message);
        }
    },

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

    getAddProducts : async ( req, res ) => {
        try {

            const categories = await categorySchema.find()
            
            res.render( 'admin/add-products',{
                admin : req.session.admin,
                categories : categories
            } )

        } catch (error) {
            console.log(error.message);
        }
    },
 
    getProductsList : ( req, res ) => {

        try {
            
            res.render('admin/products',{
                admin : req.session.admin
            })

        } catch (error) {
            console.log(error.message);
        }

        
    }
    



}