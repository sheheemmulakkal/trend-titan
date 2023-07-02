const cartSchema = require( '../models/cartModel');
const mongoose = require('mongoose');
const productSchema = require('../models/productModel');
const { kStringMaxLength } = require('buffer');
const { availableParallelism } = require('os');


module.exports = {
    getCart : async( req, res ) => {
        try {
            const { user } = req.session;
            const cartItems = await cartSchema.findOne({userId : user }).populate('items.productId');
            res.render('shop/cart',{
                cartItems : cartItems
            });
        } catch (error) {
            console.log(error.message);
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
                const Quantity = await productSchema.findOne({ _id : productId },{ quantity : 1 });
                // Checking if cart is exist
                const cart = await cartSchema.findOne({userId : userId });
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
                                const cartitmes = await cartSchema.updateOne( { userId : userId, 'items.productId' : productId },
                                { $inc : { 'items.$.quantity': 1 }}
                                );
                                res.status(200).json({ success : true, message : 'Added to cart' ,login : true });
                            } else {
                                //If cart quantity and availabe quantity are same
                                res.json({ message : "Oops! It seems you've reached the maximum quantity of products available for purchase.",
                                login : true , outOfStock : true})
                            }
                            
                        // if product not exists in cart, adding new object to items array
                        } else {
                            const cartitems = await cartSchema.updateOne( { userId : userId },
                                { $push : { items : {productId : productId } } }
                                );
                                // increasing product count in session
                                req.session.productCount++
                            res.status(200).json({  success : true, 
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
                        res.status(200).json({
                            success : 'Added to cart',
                            login : true
                        });
                    }
                // If product stock is empty
                } else {
                    res.status(404).json({error : true, message : 'Out of stock' ,login : true});
                }
            // If user not logged in 
            } else {
                res.json({login : false });
            }
            
        } catch (error) {
            console.log(error.message);
        }
    },

    decCart : async ( req, res ) => {
        try {
            const { user } = req.session ;
            const { productId } = req.body;
            const cart = await cartSchema.updateOne({ userId : user, 'items.productId' : productId},
            { $inc : { 'items.$.quantity' : -1}}
            )
            res.status(200).json({success : true, message : 'cart item decreased'});
        } catch (error) {
            console.log(error.message);
        }
    },

    removeCartItem : async ( req, res ) => {
        try {

            const { itemId } = req.body
            const { user } = req.session
            const cart = await cartSchema.updateOne({ userId : user, 'items._id': itemId },
                { $pull : { items : {_id : itemId}}})
                req.session.productCount--
                res.status(200).json({success : true, message : 'Item removed', removeItem : true})
        } catch (error) {
            console.log(error.message);
        }
    }
}