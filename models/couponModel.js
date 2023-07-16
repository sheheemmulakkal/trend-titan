const mongoose = require( 'mongoose' )

const Schema = mongoose.Schema

const couponSchema = Schema({
    name : {
        type : String,
        required : true
    },

    description : {
        type : String,
        required : true
    },

    startingDate : {
        type : Date,
        required : true
    },
    
    expiryDate : {
        type : Date,
        required : true
    },

    minimumAmount : {
        type : Number,
        required : true
    },

    discount : {
        type : Number,
        required : true
    },

    discountType : {
        type : String,
        required : true
    },

    status : {
        type : Boolean,
        default : true,
        required : true
    },

    users : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    }]

})

module.exports = mongoose.model( 'coupon', couponSchema )