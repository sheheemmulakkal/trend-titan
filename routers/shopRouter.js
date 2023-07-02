const express = require('express');

// Getting controllers
const shopController = require( '../controllers/shopController' )
const cartController = require( '../controllers/cartController')
const isAuth = require( '../middleware/isAuth');
const { isArgumentsObject } = require('util/types');

const router = express.Router();

// Routers
router.get( '/', shopController.getHome )

router.get( '/shop', shopController.getShop )

router.get( '/products/:id', shopController.getSingleProduct)

router.get( '/cart', isAuth.userAuth, cartController.getCart )

router.post( '/add-to-cart', cartController.addToCart )

router.post( '/decrease-cart', isAuth.userAuth, cartController.decCart )

router.patch( '/removeCartItem', isAuth.userAuth, cartController.removeCartItem )


module.exports = router;