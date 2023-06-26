
const mongoose = require( 'mongoose' )

const Schema = mongoose.Schema

const bannerSchema = Schema( {

    typeHead : {
        type : String 
    },

    mainHead : {
        type : String
    },

    description : {
        type : String 
    },

    image : {
        type : String 
    },

    status : {
        default : true,
        type: Boolean
    }

})

module.exports = mongoose.model( 'banner', bannerSchema)