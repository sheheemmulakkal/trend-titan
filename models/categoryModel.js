const mongoose = require( 'mongoose' )

const Schema = mongoose.Schema

const categorySchema = Schema({
    category : {
        type : String,
        required : true
    },

    status : {
        type : Boolean,
        required : true,
        default : true
    }
})


module.exports = mongoose.model( 'category', categorySchema )