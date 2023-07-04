const orderSchema = require( '../models/orderModel' )
const addressSchema = require( '../models/addressModel' )
const cartHelper = require( '../helpers/cartHelper' )


module.exports = {

    placeOrder : async ( req, res ) => {
        console.log(req.body);
        res.redirect('/checkout')
    }

}