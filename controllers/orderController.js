const crypto = require( 'crypto' )
const orderSchema = require( '../models/orderModel' )
const cartSchema = require( '../models/cartModel' )
const productSchema = require ( '../models/productModel' )
const userSchema = require( '../models/userModel' )
const cartHelper = require( '../helpers/cartHelper' )
const paginationHelper = require( '../helpers/paginationHelper' )
const paymentHelper = require( '../helpers/paymentHelper' )
const couponHelper = require( '../helpers/couponHelper' )
const couponSchema = require('../models/couponModel')
const { RAZORPAY_KEY_SECRET } = process.env


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
            const cart = await cartSchema.findOne({ userId : user })
            const totalAmount = await cartHelper.totalCartPrice( user )
            let discounted
            if( cart && cart.coupon && totalAmount && totalAmount.length > 0 ) {
                discounted = await couponHelper.discountPrice( cart.coupon, totalAmount[0].total )
                await couponSchema.updateOne({ _id : cart.coupon},{
                    $push : {
                        users : user
                    }
                })
            }
            const totalPrice = discounted && discounted.discountedTotal ? discounted.discountedTotal : totalAmount[0].total
            paymentMethod === 'COD' ? orderStatus = 'Confirmed' : orderStatus = 'Pending';
            const order = new orderSchema({
                userId : user,
                products : cartProducts,
                totalPrice : totalPrice,
                paymentMethod : paymentMethod,
                orderStatus : orderStatus,
                address : addressId,
            })
            const ordered = await order.save()
            

            // Decreasing quantity
            for( const items of cartProducts ){
                
                const { productId, quantity } = items

                await productSchema.updateOne({_id : productId},
                    { $inc : { quantity :  -quantity  }})
                } 
            // Deleting cart
            await cartSchema.deleteOne({ userId : user })
            req.session.productCount = 0
            
            if(  paymentMethod === 'COD' ){
                // COD
                
                    return res.json({ success : true})
            } else if( paymentMethod === 'razorpay'){
                // Razorpay 
                const payment = await paymentHelper.razorpayPayment( ordered._id, totalPrice )
                res.json({ payment : payment , success : false  })
            }
        } catch ( error ) {
            console.log( error.message );
        }
    },

    razorpayVerifyPayment : async( req, res ) => {
        const { response , order } = req.body
        let hmac = crypto.createHmac( 'sha256', RAZORPAY_KEY_SECRET )
        hmac.update( response.razorpay_order_id + '|' + response.razorpay_payment_id )
        hmac = hmac.digest( 'hex' )


        if( hmac === response.razorpay_signature ){
            await orderSchema.updateOne({_id : order.receipt},{
                $set : { orderStatus : 'Confirmed'}
            })
            
            res.json({paid : true})
        } else {
            res.json({paid : false})
        }
    },

    getConfirmOrder : async( req, res ) => {
        try{
            const { user } = req.session
            const products =  await cartHelper.totalCartPrice( user )
            
            const orders = await orderSchema.find({ userId : user }).sort({ date : -1 }).limit( 1 ).populate( 'products.productId' ).populate( 'address' )

            if( orders.orderStatus === "Pending"){
                await orderSchema.updateOne({ _id : orders._id },{
                    $set : {
                        orderStatus : "Confirmed"
                    }
                })
            }
                // await cartSchema.deleteOne({ userId : user })
                // req.session.productCount = 0

                // for( const items of cartProducts ){
                //     const { productId, quantity } = items
                //     await productSchema.updateOne({_id : productId},
                //         { $inc : { quantity :  -quantity  }})
                // } 
            
            const lastOrder = await orderSchema.find({ userId : user }).sort({ date : -1 }).limit( 1 ).populate( 'products.productId' ).populate( 'address' )

            res.render( 'shop/confirm-order', {
                order : lastOrder,
                products : lastOrder[0].products,
            })
        }catch( error ){
            console.log( error.message );
        }

    },

    getAdminOrderlist : async( req, res ) => {
        try{
            const { sortData, sortOrder } = req.query
            let page = Number(req.query.page);
            if (isNaN(page) || page < 1) {
            page = 1;
            }
            const sort = {}

            if( sortData ) {
                if( sortOrder === "Ascending" ){
                    sort[sortData] = 1
                } else {
                    sort[sortData] = -1
                }
            } else {
                sort['date'] = -1
            }
            
            

            const ordersCount = await orderSchema.find().count()
            const orders = await orderSchema.find()
                .sort(sort).skip(( page - 1 ) * paginationHelper.ORDER_PER_PAGE ).limit( paginationHelper.ORDER_PER_PAGE )
                .populate( 'userId' ).populate( 'products.productId' ).populate( 'address' )
            res.render( 'admin/orders', {
                orders : orders,
                admin : true,
                currentPage : page,
                hasNextPage : page * paginationHelper.ORDER_PER_PAGE < ordersCount,
                hasPrevPage : page > 1,
                nextPage : page + 1,
                prevPage : page -1,
                lastPage : Math.ceil( ordersCount / paginationHelper.ORDER_PER_PAGE ),
                sortData : sortData,
                sortOrder : sortOrder
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
            const orders = await orderSchema.find({ userId : user }).sort({ date : -1 })
            .populate( 'products.productId' ).populate( 'address' )
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
    },

    getSalesReport : async ( req, res ) => {
        
        const { from, to, seeAll, sortData, sortOrder } = req.query
        let page = Number(req.query.page);
            if (isNaN(page) || page < 1) {
            page = 1;
            }
        const conditions = {}
        if( from && to){
            conditions.date = {
                $gte : from,
                $lte : to
            }
        } else if ( from ) {
            conditions.date = {
                $gte : from
            }
        } else if ( to ){
            conditions.date = {
                $lte : to
            }
        }
        const sort = {}

        if( sortData ) {
            if( sortOrder === "Ascending" ){
                sort[sortData] = 1
            } else {
                sort[sortData] = -1
            }
        } else {
            sort['date'] = -1
        }

        const orderCount = await orderSchema.count()
        const limit = seeAll === "seeAll" ? orderCount : paginationHelper.SALES_PER_PAGE ;
      

        const orders = await orderSchema.find( conditions )
        .sort( sort ).skip(( page - 1 ) * paginationHelper.ORDER_PER_PAGE ).limit(limit)

        res.render( 'admin/sales-report', {
            admin : true,
            orders : orders,
            from : from,
            to : to, 
            seeAll : seeAll,
            currentPage : page,
            hasNextPage : page * paginationHelper.SALES_PER_PAGE < orderCount,
            hasPrevPage : page > 1,
            nextPage : page + 1,
            prevPage : page -1,
            lastPage : Math.ceil( orderCount / paginationHelper.SALES_PER_PAGE ),
            sortData : sortData,
            sortOrder : sortOrder
        })  

    }

}