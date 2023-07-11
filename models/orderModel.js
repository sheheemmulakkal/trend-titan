const mongoose = require('mongoose')

const Schema = mongoose.Schema

const orderSchema = Schema({

    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user',
        required : true
    },

    products : [{
        productId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'product',
            required : true
        },
        quantity : {
            type : Number,
            required : true
        },
        price : {
            type : Number,
            required : true
        }
    }],

    totalPrice : {
        type : Number,
        required : true
    },

    paymentMethod : {
        type : String,
        required : true
    },

    orderStatus : {
        type : String,
        default : 'Pending'
    },

    address : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'address',
        required : true
    },

    date : {
        type : Date,
        default : Date.now
    }
})

module.exports = mongoose.model('order',orderSchema)