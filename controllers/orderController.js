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
            const { addressId } = req.body
            const productItems = products[0].items

            const cartProducts = productItems.map( (items) => ({
                productId : items.productId,
                quantity : items.quantity,
                price : (items.totalPrice / items.quantity)
            }))
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
                    { $inc : { quantity :  -quantity  }})
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

    },

    getAdminOrderlist : async( req, res ) => {
        try{
            const orders = await orderSchema.find().populate('userId').populate('products.productId').populate('address')
            res.render('admin/orders',{
                orders : orders,
                admin : true
            })
        }catch(error){
            console.log(error.message);
        }
    },

    changeOrderStatus : async ( req, res ) => {
       try {
            const {status, orderId} = req.body
            const update = await orderSchema.findOneAndUpdate({_id : orderId},
                { $set : { orderStatus : status }}) 
            const newStatus = await orderSchema.findOne({ _id : orderId })
            res.status(200).json({success : true, status : newStatus.orderStatus })
       } catch (error) {
            console.log(error.message);
       }
    }

}