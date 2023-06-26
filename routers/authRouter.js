const express = require( 'express' )

const router = express.Router()

const authController = require( '../controllers/authController' )
const isAuth = require( '../middleware/isAuth' )

router.get( '/login', isAuth.userLoggedout, authController.getUserLogin )

router.post( '/login', isAuth.userLoggedout, authController.doUserLogin )

router.get( '/signup', isAuth.userLoggedout, authController.getUserSignup )

router.post( '/signup', isAuth.userLoggedout, authController.doUserSignup ) 

router.get( '/otp-verification', isAuth.userLoggedout, authController.getSignupOtp )

router.post( '/otp-verification', isAuth.userLoggedout, authController.signupVerification )

router.get( '/logout', isAuth.userAuth, authController.doUserLogout )


module.exports = router