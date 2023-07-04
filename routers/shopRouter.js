const express = require('express');

// Getting controllers
const shopController = require( '../controllers/shopController' )
const cartController = require( '../controllers/cartController')
const orderController = require( '../controllers/orderController' )
const isAuth = require( '../middleware/isAuth');
const { isArgumentsObject } = require('util/types');
const { is } = require('date-fns/locale');

const router = express.Router();

// Routers
router.get( '/', shopController.getHome )

router.get( '/shop', shopController.getShop )

router.get( '/products/:id', shopController.getSingleProduct)

router.get( '/cart', isAuth.userAuth, cartController.getCart )

router.post( '/add-to-cart', cartController.addToCart )

router.post( '/decrease-cart', isAuth.userAuth, cartController.decCart )

router.patch( '/removeCartItem', isAuth.userAuth, cartController.removeCartItem )

router.get( '/checkout', isAuth.userAuth, shopController.getCheckout )

router.get( '/add-checkout-address', isAuth.userAuth, shopController.getCheckoutAddAddress)

router.post( '/add-checkout-address', isAuth.userAuth, shopController.checkoutAddAddress)

router.post( '/place-order', isAuth.userAuth, orderController.placeOrder )

router.get( '/confirm-order', isAuth.userAuth, orderController.getConfirmOrder)



module.exports = router;