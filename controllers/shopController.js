
const productSchema = require( '../models/productModel' )
const categorySchema = require( '../models/categoryModel' )
const cartSchema = require( '../models/cartModel' )
const bannerSchema = require( '../models/bannerModel' )
const userSchema = require( '../models/userModel' )
const addressSchema = require( '../models/addressModel' )
const cartHelper = require( '../helpers/cartHelper' )
const paginationHelper = require( '../helpers/paginationHelper' )
const couponHelper = require( '../helpers/couponHelper' )
const { search } = require('../routers/shopRouter')


module.exports = {

    // Home page GET
    getHome : async( req, res ) => {
        try {
            const banners = await bannerSchema.find({ status : true })
            const products = await productSchema.find({ status : true })
            .populate({
                path : 'offer',
                match :  { startingDate : { $lte : new Date() }, expiryDate : { $gte : new Date() }}
            })
            .populate({
                path : 'category',
                populate : {
                    path : 'offer',
                    match : { startingDate : { $lte : new Date() }, expiryDate : { $gte : new Date() }}
                }
            })
            res.render( 'shop/home', {
                products : products,
                banners : banners
            }) 
        } catch ( error ) {
            console.log( error.message );
        }
    },

    // Shop page GET
    getShop : async( req, res ) => {
        try {
            const { cat, brand, search } = req.query
            let page = Number( req.query.page );
            if ( isNaN(page) || page < 1 ) {
            page = 1;
            }
            const condition = { status : true }
            if ( cat ){
                condition.category = cat
            }
            if( brand ) {
                condition.brand = brand
            }
            if( search ) {
                condition.$or = [
                    { name : { $regex : search, $options : "i" }},
                    { description : { $regex : search, $options : "i" }},
                ]
            }
            const productCount = await productSchema.find(condition).count()
            const products = await productSchema.find( condition )
            .populate({
                path : 'offer',
                match :  { startingDate : { $lte : new Date() }, expiryDate : { $gte : new Date() }}
            })
            .populate({
                path : 'category',
                populate : {
                    path : 'offer',
                    match : { startingDate : { $lte : new Date() }, expiryDate : { $gte : new Date() }}
                }
            })
            .skip( ( page - 1 ) * paginationHelper.ITEMS_PER_PAGE ).limit( paginationHelper.ITEMS_PER_PAGE )  // Pagination
            const category = await categorySchema.find({ status: true }) 
            const brands = await productSchema.distinct( 'brand' )
            const startingNo = (( page - 1) * paginationHelper.ITEMS_PER_PAGE ) + 1
            const endingNo = startingNo + paginationHelper.ITEMS_PER_PAGE
            res.render( 'shop/shop', {
                products  : products,
                category : category,
                brands : brands,
                totalCount : productCount,
                currentPage : page,
                hasNextPage : page * paginationHelper.ITEMS_PER_PAGE < productCount, // Checks is there is any product to show to next page
                hasPrevPage : page > 1,
                nextPage : page + 1,
                prevPage : page -1,
                lastPage : Math.ceil( productCount / paginationHelper.ITEMS_PER_PAGE ),
                startingNo : startingNo,
                endingNo : endingNo,
                cat : cat,
                brand : brand,
                search : search
            })
              
        } catch ( error ) {
            res.redirect('/500')

        }
    },

    // Single product GET
    getSingleProduct : async( req, res ) => {
        try {
            const product = await productSchema.find({ _id : req.params.id, status : true })
            .populate({
                path : 'offer',
                match :  { startingDate : { $lte : new Date() }, expiryDate : { $gte : new Date() }}
            })
            .populate({
                path : 'category',
                populate : {
                    path : 'offer',
                    match : { startingDate : { $lte : new Date() }, expiryDate : { $gte : new Date() }}
                }
            })      
            const related = await productSchema.find({ status : true })
            .populate({
                path : 'offer',
                match :  { startingDate : { $lte : new Date() }, expiryDate : { $gte : new Date() }}
            })
            .populate({
                path : 'category',
                populate : {
                    path : 'offer',
                    match : { startingDate : { $lte : new Date() }, expiryDate : { $gte : new Date() }}
                }
            })   
            .limit( 4 )
            res.render( 'shop/single-product', {
                product : product,
                related : related
            })
        } catch ( error ) {
            res.redirect('/500')

        }

    },

    getCheckout : async( req, res ) => {
        try {
            const { user } = req.session
            const cartAmount = await cartHelper.totalCartPrice( user )
            const cart = await cartSchema.findOne({ userId : user })
            const userDetails = await userSchema.findOne({ _id : user })
            let discounted
            if( cart && cart.coupon && cartAmount && cartAmount.length > 0 ) {
                discounted = await couponHelper.discountPrice( cart.coupon, cartAmount[0].total )
            }
            const address = await userSchema.findOne({ _id : user }).populate( 'address' )
            const addresses = address.address.reverse()
            res.render( 'shop/checkout', {
                cartAmount : cartAmount,
                address : addresses,
                discounted : discounted,
                user : userDetails
            })
        } catch ( error ) {
            res.redirect('/500')

        }
    },

    getCheckoutAddAddress : async( req, res ) => {
        res.render( 'shop/checkout-address' )
    },
    checkoutAddAddress : async ( req, res ) => {
        try{
            const address = new addressSchema({
                fullName:req.body.fullName,
                mobile:req.body.mobile,
                landmark:req.body.landmark,
                street:req.body.street,
                village:req.body.village,
                city:req.body.city,
                pincode:req.body.pincode,
                state:req.body.state,
                country:req.body.country,
                userId : req.session.user
            })
            const result = await address.save()
            await userSchema.updateOne({ _id : req.session.user }, {
                 $push : { address : result._id}
            })
            res.redirect( '/checkout' )
        } catch ( error ) {
            res.redirect('/500')

        }
    },

    searchSuggestion : async ( req, res ) => {
        try {
            
            const { searchField } = req.query
            const suggestions = await productSchema.find({status : true, $or : [
                { name : { $regex : searchField, $options : "i" }},
                { description : { $regex : searchField, $options : "i" }}
                ]
            },{name : 1}) 
            res.json({ suggestions : suggestions , success : true }) 
        } catch (error) {
            res.redirect('/500')

        }
        
    }  

}