 const express = require( 'express' )
 const userController = require('../controllers/userController')
 const isAuth = require('../middleware/isAuth')
 const orderController = require('../controllers/orderController')

 const router = express.Router()

 router.get( '/profile', isAuth.userAuth, userController.getUserProfile )
 router.put( '/edit-profile', isAuth.userAuth, userController.editProfile )

 router.get( '/address', isAuth.userAuth, userController.getAddress )
 router.get( '/add-address', isAuth.userAuth, userController.getAddAddress )
 router.post( '/add-address', isAuth.userAuth, userController.addAddress)
 router.get( '/edit-address/:id', isAuth.userAuth, userController.getEditAddress )
 router.post( '/edit-address', isAuth.userAuth, userController.editAddress )  
 router.patch( '/remove-address/:id', isAuth.userAuth, userController.removeAddress )
 
 router.get( '/orders', isAuth.userAuth, orderController.getOrders )  
 router.patch( '/cancel-order', isAuth.userAuth, orderController.userCancelOrder )  
 router.get( '/view-order-products/:id', isAuth.userAuth, orderController.userOrderProducts )  

 module.exports = router   