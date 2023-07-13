const mongoose = require( 'mongoose' )

const Schema = mongoose.Schema

const wishlistSchema = Schema({
    
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },

    products :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'product',
        required : true
    }]
})

module.exports = mongoose.model( 'wishlist', wishlistSchema )