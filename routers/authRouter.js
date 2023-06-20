const express = require( 'express' )

const router = express.Router()

const authController = require( '../controllers/authController' )

router.get( '/login', authController.getUserLogin )

router.post( '/login', authController.doUserLogin )

router.get( '/signup', authController.getUserSignup )

router.post( '/signup', authController.doUserSignup )


module.exports = router