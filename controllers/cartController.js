const cartSchema = require( '../models/cartModel' );
const productSchema = require( '../models/productModel' );
const couponSchema = require( '../models/couponModel' )  
const cartHelper = require( '../helpers/cartHelper' );
const couponHelper = require( '../helpers/couponHelper' );



module.exports = {
    getCart : async( req, res ) => {
        try {
            const { user } = req.session;   
             let discounted
            const productCount = await cartHelper.updateQuantity( user )
            if( productCount === 1 ){
                req.session.productCount--
            }
            const updatedCart = await cartSchema.findOne({ userId : user }).populate({
                path : 'items.productId',
                populate : [{
                    path : 'category',
                    populate : {
                        path : 'offer'
                    },
                },
                    {
                    path : 'offer'
                    }
                ]
            });
            const totalPrice = await cartHelper.totalCartPrice( user )

            updatedCart.items.forEach(( items ) => {
               
                if( items.productId.offer && items.productId.offer.startingDate <= new Date() && items.productId.offer.expiryDate >= new Date() ) {
                    items.productId.price = (items.productId.price * ( 1 - ( items.productId.offer.percentage / 100 ))).toFixed(0)
                }else if ( items.productId.category.offer && items.productId.category.offer.startingDate <= new Date() && items.productId.category.offer.expiryDate >= new Date() ) {
                    items.productId.price = (items.productId.price * ( 1 - ( items.productId.category.offer.percentage / 100 ))).toFixed(0)
                }
                console.log(items.productId.price);
                return items
            })

            // console.log(updatedCart.items[0]);
            if( updatedCart && updatedCart.coupon && totalPrice && totalPrice.length > 0 ) {
                discounted = await couponHelper.discountPrice( updatedCart.coupon, totalPrice[0].total )
            }
            
            const availableCoupons = await couponSchema.find({ status : true , startingDate : { $lte : new Date() }, expiryDate : { $gte : new Date() } })

            res.render( 'shop/cart', {
                cartItems : updatedCart,
                totalAmount : totalPrice,
                availableCoupons : availableCoupons,
                discounted : discounted

            });
        } catch ( error ) {
            console.log( error.message );
        }
    },

    addToCart : async ( req, res ) => {
        try {
            
            // checking is user logged In
            if( req.session.user ){
                // If logged in
                userId = req.session.user;
                productId = req.body.productId;

                // Getting stock quantity
                const Quantity = await productSchema.findOne({ _id : productId }, { quantity : 1 });
                // Checking if cart is exist
                const cart = await cartSchema.findOne({ userId : userId });
                const stockQuantity = Quantity.quantity
                if( stockQuantity > 0 ){
                    // If cart exist
                    if( cart ) {

                        // if Product exists in cart
                        const exist = cart.items.find( item => item.productId == productId );
                        if( exist ) {
                            // Checking stock quantity with cart quantity
                            const availableQuantity = stockQuantity - exist.quantity
                            if( availableQuantity > 0 ) {
                                // quantity increases
                                await cartSchema.updateOne( { userId : userId, 'items.productId' : productId },
                                { $inc : { 'items.$.quantity': 1 }}
                                );
                                //total price of cart
                                const totalPrice = await cartHelper.totalCartPrice( userId )

                                let discounted
                                if( cart.coupon && totalPrice && totalPrice.length > 0 ) {
                                    discounted = await couponHelper.discountPrice( cart.coupon, totalPrice[0].total )
                                }

                                res.status( 200 ).json({ success : true, message : 'Added to cart' ,login : true, totalPrice : totalPrice, discounted : discounted });
                            } else {
                                //If cart quantity and availabe quantity are same
                                res.json({ message : "Oops! It seems you've reached the maximum quantity of products available for purchase.",
                                login : true , outOfStock : true })
                            }
                            
                        // if product not exists in cart, adding new object to items array
                        } else {
                            await cartSchema.updateOne( { userId : userId },
                                { $push : { items : { productId : productId } } }
                                );
                                // increasing product count in session
                                req.session.productCount++
                                res.status( 200 ).json({  success : true, 
                                                    message : 'Added to cart',
                                                    newItem : true,
                                                    login : true });
                        }
                    // If cart not exist !!!
                    } else {
                        // Creating new cart for user
                        const newCart = new cartSchema({
                            userId : req.session.user,
                            items : [{ productId : productId }]
                        });
                        await newCart.save();
                        req.session.productCount++
                        res.status( 200 ).json({
                            success : 'Added to cart',
                            login : true,
                            newItem : true
                        });
                    }
                // If product stock is empty
                } else {
                    res.json({ error : true, message : 'Out of stock', login : true, outOfStock : true });
                }
            // If user not logged in 
            } else {
                res.json({ login : false });
            }
            
        } catch ( error ) {
            console.log( error.message );
        }
    },

    decCart : async ( req, res ) => {
        try {
            const { user } = req.session ;
            const { productId } = req.body;
            await cartSchema.updateOne({ userId : user, 'items.productId' : productId },
            { $inc : { 'items.$.quantity' : -1 }}
            )
            const totalPrice = await cartHelper.totalCartPrice( user )
            const cart = await cartSchema.findOne({ userId : user})
            let discounted
            if( cart.coupon && totalPrice && totalPrice.length > 0 ) {
                discounted = await couponHelper.discountPrice( cart.coupon, totalPrice[0].total )
            }
            res.status( 200 ).json({ success : true, message : 'cart item decreased', totalPrice : totalPrice, discounted : discounted });
        } catch ( error ) {
            console.log( error.message );
        }
    },

    removeCartItem : async ( req, res ) => {
        try {

            const { itemId } = req.body
            const { user } = req.session
            await cartSchema.updateOne({ userId : user, 'items._id': itemId },
                { $pull : { items : { _id : itemId }}})
                req.session.productCount--
                if( req.session.productCount === 0 ){
                    await cartSchema.deleteOne({ userId : user})
                }
                const totalPrice = await cartHelper.totalCartPrice(user)
                const cart = await cartSchema.findOne({ userId : user})
                let discounted
                if( cart && cart.coupon && totalPrice && totalPrice.length > 0 ) {
                    discounted = await couponHelper.discountPrice( cart.coupon, totalPrice[0].total )
                }
                res.status( 200 ).json({ success : true, message : 'Item removed', removeItem : true, totalPrice : totalPrice, discounted : discounted })
        } catch ( error ) {
            console.log( error.message );
        }
    }
}