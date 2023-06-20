const express = require( 'express' )

const authController = require( '../controllers/authController' )

const router = express.Router()

router.get( '/login', authController.getAdminLogin )

router.post( '/login', authController.doAdminLogin )

module.exports = router