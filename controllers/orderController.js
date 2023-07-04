const orderSchema = require( '../models/orderModel' )
const addressSchema = require( '../models/addressModel' )
const cartSchema = require( '../models/cartModel' )
const productSchema = require ( '../models/productModel' )
const cartHelper = require( '../helpers/cartHelper' )



module.exports = {

    placeOrder : async ( req, res ) => {

        try {
            const { user } = req.session
            const products =  await cartHelper.totalCartPrice(user)
            const { paymentMethod } = req.body
            console.log(req.body);
            const { addressId } = req.body
            const productItems = products[0].items

            const cartProducts = productItems.map( (items) => ({
                productId : items.productId,
                quantity : items.quantity,
                price : (items.totalPrice / items.quantity)
            }))
            console.log(cartProducts);
            const totalPrice = products[0].total 

            const order = new orderSchema({
                userId : user,
                products : cartProducts,
                totalPrice : totalPrice,
                paymentMethod : paymentMethod,
                address : addressId,
            })
            await order.save()
            await cartSchema.deleteOne({userId : user})
            req.session.productCount = 0

            for( const items of cartProducts ){
                const { productId, quantity } = items
                await productSchema.updateOne({_id : productId},
                    { $inc : { quantity : (quantity * (-1))}})
            }
 
            res.redirect('/confirm-order')
        } catch (error) {
            console.log(error.message);
        }
    },

    getConfirmOrder : async( req, res ) => {
        try{
            res.render('shop/confirm-order')
        }catch(error){
            console.log(error.message);
        }

    }

}