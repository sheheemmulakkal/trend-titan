const mongoose = require( 'mongoose' )

const Schema = mongoose.Schema

const productSchema = Schema({

    name : {
        type : String,
        required : true
    },

    description : {
        type : String,
        required : true
    },

    brand : {
        type : String, 
        required : true
    },

    category : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'category',
        required : true
    },

    quantity : {
        type : Number,
        required : true
    },

    price : {
        type : Number,
        required : true
    },

    image : {
        type : Array,
        required : true
    }, 

    status : {
        type : Boolean,
        default : true
    }
    
})


module.exports = mongoose.model('product', productSchema)   