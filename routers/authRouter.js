const express = require( 'express' )

const router = express.Router()

const authController = require( '../controllers/authController' )
const isAuth = require( '../middleware/isAuth' )

router.get( '/login', isAuth.userLoggedout, authController.getUserLogin )

router.post( '/login', isAuth.userLoggedout, authController.doUserLogin )

router.get( '/signup', isAuth.userLoggedout, authController.getUserSignup )

router.post( '/signup', isAuth.userLoggedout, authController.doUserSignup )


module.exports = router