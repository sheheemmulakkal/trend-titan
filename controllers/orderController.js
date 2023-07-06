const orderSchema = require( '../models/orderModel' )
const cartSchema = require( '../models/cartModel' )
const productSchema = require ( '../models/productModel' )
const userSchema = require( '../models/userModel')
const cartHelper = require( '../helpers/cartHelper' )



module.exports = {

    placeOrder : async ( req, res ) => {

        try {
            const { user } = req.session
            const products =  await cartHelper.totalCartPrice( user )
            const { paymentMethod } = req.body
            const { addressId } = req.body
            const productItems = products[0].items

            const cartProducts = productItems.map( ( items ) => ({
                productId : items.productId,
                quantity : items.quantity,
                price : ( items.totalPrice / items.quantity )
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
            await cartSchema.deleteOne({ userId : user })
            req.session.productCount = 0

            for( const items of cartProducts ){
                const { productId, quantity } = items
                await productSchema.updateOne({_id : productId},
                    { $inc : { quantity :  -quantity  }})
            }
 
            res.redirect( '/confirm-order' )
        } catch ( error ) {
            console.log( error.message );
        }
    },

    getConfirmOrder : async( req, res ) => {
        try{
            const { user } = req.session
            const orders = await orderSchema.find({ userId : user}).sort({ date : -1 }).limit( 1 ).populate( 'products.productId' ).populate( 'address' )
            res.render( 'shop/confirm-order', {
                order : orders,
                products : orders[0].products,
            })
        }catch( error ){
            console.log( error.message );
        }

    },

    getAdminOrderlist : async( req, res ) => {
        try{
            const orders = await orderSchema.find().populate( 'userId' ).populate( 'products.productId' ).populate( 'address' )
            res.render( 'admin/orders', {
                orders : orders,
                admin : true
            })
        }catch( error ){
            console.log( error.message );
        }
    },

    changeOrderStatus : async ( req, res ) => {
       try {
            const { status, orderId } = req.body
            if( status === 'Cancelled'){
                // If order cancelled. The product quantity increases back
                const order = await orderSchema.findOne({ _id : orderId })
                for( let products of order.products ){
                    await productSchema.updateOne({ _id : products.productId },{
                        $inc : { quantity : products.quantity }
                    })
                }
                // sets the orders status
                    await orderSchema.findOneAndUpdate({ _id : orderId },
                        { $set : { orderStatus : status }}) 
                } else {
                    // sets the order status
                    await orderSchema.findOneAndUpdate({ _id : orderId },
                        { $set : { orderStatus : status }}) 
                }
            const newStatus = await orderSchema.findOne({ _id : orderId })
            res.status( 200 ).json({ success : true, status : newStatus.orderStatus })
       } catch ( error ) {
            console.log(error.message);
       }
    },

    getOrders : async( req, res ) => {
        try {
            const { user } = req.session
            const orders = await orderSchema.find({ userId : user }).populate( 'products.productId' ).populate( 'address' )
            const userDetails = await userSchema.findOne({ _id : user }) 
            res.render( 'user/orders', {
                orders : orders,
                user : userDetails
            })
        } catch ( error ) {
            console.log( error.message );
        }
    },

    userCancelOrder :  async ( req, res ) => {
        try {
            const { orderId, status } = req.body
            const order = await orderSchema.findOne({ _id : orderId })
            for( let products of order.products ){
                await productSchema.updateOne({ _id : products.productId }, {
                    $inc : { quantity : products.quantity }
                })
            }

            await orderSchema.findOneAndUpdate({ _id : orderId },
                { $set : { orderStatus : status }}) 

            const newStatus = await orderSchema.findOne({ _id : orderId })
            res.status( 200 ).json({ success : true, status : newStatus.orderStatus })
        } catch ( error ) {
            console.log( error.message );
        }
    },

    userOrderProducts : async ( req, res ) => {
        try {
            const { id } = req.params
            const order = await orderSchema.findOne({ _id : id }).populate( 'products.productId' ).populate( 'address' )
            res.render( 'user/order-products', {
                order : order,
                products : order.products
            })
            
        } catch ( error ) {
            console.log( error.message );
        }
    },

    adminOrderProducts : async ( req, res ) => {
        try {
            const { id } = req.params
            const order = await orderSchema.findOne({ _id : id }).populate( 'products.productId' ).populate( 'address' )
            res.render( 'admin/order-products', {
                order : order,
                products : order.products,
                admin : true
            })
            
        } catch ( error ) {
            console.log( error.message );
        }
    }

}