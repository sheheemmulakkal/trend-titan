const mongoose = require('mongoose')

const Schema = mongoose.Schema

const cartSchema = Schema({
    
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },

    items : [{
        productId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'product',
            required : true
        },

        quantity : {
            type : Number,
            default : 1
        }
    }],

    coupon : {
        type : mongoose.Schema.Types.ObjectId,
        requried : false
    }
})

module.exports = mongoose.model('cart', cartSchema)