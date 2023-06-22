const express = require( 'express' )

const authController = require( '../controllers/authController' )
const adminController = require( '../controllers/adminController')
const isAuth = require ( '../middleware/isAuth')

const router = express.Router()

router.get( '/login', isAuth.adminLoggedOut,  authController.getAdminLogin )

router.post( '/login', isAuth.adminLoggedOut, authController.doAdminLogin )

router.get( '/logout', isAuth.adminAuth, authController.doAdminLogout )

router.get( '/userList', isAuth.adminAuth, adminController.getUserList )

router.get( '/', isAuth.adminAuth, adminController.getAdminHome )

router.get( '/block-user/:id', isAuth.adminAuth, adminController.blockUser )

router.get( '/unblock-user/:id', isAuth.adminAuth, adminController.unBlockUser )

module.exports = router 