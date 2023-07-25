const mongoose = require( 'mongoose' )

const Schema = mongoose.Schema

const userSchema = Schema({

    firstName : {
        type : String,
        required : true
    },

    lastName : {
        type : String,
        required : true
    },

    email : {
        type : String,
        required : true
    },

    mobile : {
        type : String,
        required : true
    },

    password : {
        type : String,
        required : true
    },

    isAdmin : {
        type : Number,
        default : 0
    },

    isVerified : {
        type : Boolean,
        default : false
    },

    token : {
        
        otp : {
            type : Number
            
        },
        generatedTime : {
            type : Date
        }
    },

    isBlocked : {
        type : Boolean,
        default : false
    },

    joinedDate : {
        type : Date,
        default : Date.now
    },

    address : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'address'
    }],

    wallet : {
        type : Number,
        default : 0
    },

    walletHistory : [{
        date : {
            type : Date,
        },
        amount : {
            type : Number
        },
        message : {
            type : String
        }

    }],

    referralCode : {
        type : String
    },

    isReferred : {
        type : String
    }


})

module.exports = mongoose.model( 'user', userSchema )