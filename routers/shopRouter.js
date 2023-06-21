const express = require('express');

// Getting controllers
const shopController = require( '../controllers/shopController' )
const isAuth = require( '../middleware/isAuth')

const router = express.Router();

// Routers
router.get( '/', shopController.getHome )

router.get( '/shop', isAuth.userAuth, shopController.getShop )



module.exports = router;