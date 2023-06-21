const express = require( 'express' )

const authController = require( '../controllers/authController' )
const adminController = require( '../controllers/adminController')
const isAuth = require ( '../middleware/isAuth')

const router = express.Router()

router.get( '/login', isAuth.adminLoggedOut,  authController.getAdminLogin )

router.post( '/login', isAuth.adminLoggedOut, authController.doAdminLogin )

router.get( '/', isAuth.adminAuth, adminController.getAdminHome )

module.exports = router