const express = require('express');

// Getting controllers
const shopController = require( '../controllers/shopController' )

const router = express.Router();

// Routers
router.get( '/', shopController.getHome )



module.exports = router;