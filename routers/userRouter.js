 const express = require( 'express' )
 const userController = require('../controllers/userController')
 const isAuth = require('../middleware/isAuth')

 const router = express.Router()

 router.get( '/profile', isAuth.userAuth, userController.getUserProfile )
 
 router.put( '/edit-profile', isAuth.userAuth, userController.editProfile )

 router.get( '/address', isAuth.userAuth, userController.getAddress )
 
 router.get( '/add-address', isAuth.userAuth, userController.getAddAddress )

 router.post( '/add-address', isAuth.userAuth, userController.addAddress)

 router.get( '/edit-address/:id', isAuth.userAuth, userController.getEditAddress )
 
 router.post( '/edit-address', isAuth.userAuth, userController.editAddress )

 router.patch( '/remove-address/:id', isAuth.userAuth, userController.removeAddress )

 module.exports = router   