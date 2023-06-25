const express = require('express');

// Getting controllers
const shopController = require( '../controllers/shopController' )
const isAuth = require( '../middleware/isAuth')

const router = express.Router();

// Routers
router.get( '/', shopController.getHome )

router.get( '/shop', shopController.getShop )

router.get( '/products/:id', shopController.getSingleProduct)



module.exports = router;