
const productSchema = require( '../models/productModel' )
const categorySchema = require( '../models/categoryModel' )
const bannerSchema = require( '../models/bannerModel' )
const userSchema = require( '../models/userModel' )
const addressSchema = require( '../models/addressModel' )
const cartHelper = require( '../helpers/cartHelper' )
const paginationHelper = require( '../helpers/paginationHelper' )



module.exports = {

    // Home page GET
    getHome : async( req, res ) => {

        try {

            const banners = await bannerSchema.find({ status : true })
            const products = await productSchema.find({ status : true })
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
            let page = Number(req.query.page);
            if (isNaN(page) || page < 1) {
            page = 1;
            }
            const productCount = await productSchema.find({ status : true }).count()
            const products = await productSchema.find({ status: true })
            .skip( ( page - 1 ) * paginationHelper.ITEMS_PER_PAGE ).limit( paginationHelper.ITEMS_PER_PAGE )  // Pagination

            const category = await categorySchema.find({ status: true }) 
            const brands = await productSchema.distinct( 'brand' )

            const startingNo = (( page - 1) * paginationHelper.ITEMS_PER_PAGE) + 1
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
                endingNo : endingNo
            })
              
        } catch ( error ) {
            console.log( error.message );
        }
    },

    // Single product GET
    getSingleProduct : async( req, res ) => {

        try {
            const product = await productSchema.find({ _id : req.params.id, status : true }).populate( 'category' )         
            const related = await productSchema.find({ status : true }).limit( 4 )
            res.render( 'shop/single-product', {
                product : product,
                related : related
            })

        } catch ( error ) {
            console.log( error.message );
        }

    },

    getCheckout : async( req, res ) => {
        try {
            const { user } = req.session
            const cartAmount = await cartHelper.totalCartPrice( user )
            const address = await userSchema.findOne({ _id : user }).populate( 'address' )
            const addresses = address.address.reverse()
            res.render( 'shop/checkout', {
                cartAmount : cartAmount,
                address : addresses
            })
        } catch ( error ) {
            console.log( error.message );
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
            console.log( error.message ); 
        }
    }

}