const express = require( 'express' )
const path = require( 'path' )

const authController = require( '../controllers/authController' )
const adminController = require( '../controllers/adminController' )
const productController = require( '../controllers/productController' )
const categoryController = require( '../controllers/categoryController' )
const bannerController = require( '../controllers/bannerController' )
const couponController = require( '../controllers/couponController' )
const offerController = require( '../controllers/offerController' )
const multer = require('multer')
const isAuth = require ( '../middleware/isAuth' )
const upload = require( '../middleware/multer' )

const orderController = require( '../controllers/orderController' )
const router = express.Router()

// Routes 

router.get( '/login', isAuth.adminLoggedOut,  authController.getAdminLogin )
router.post( '/login', isAuth.adminLoggedOut, authController.doAdminLogin )
router.get( '/logout', isAuth.adminAuth, authController.doAdminLogout )

router.get( '/', isAuth.adminAuth, adminController.getAdminHome )

router.get( '/userList', isAuth.adminAuth, adminController.getUserList )
router.patch( '/block-user/:id', isAuth.adminAuth, adminController.blockUser )
router.patch( '/unblock-user/:id', isAuth.adminAuth, adminController.unBlockUser )


router.get( '/category', isAuth.adminAuth, categoryController.getCategory )
router.post( '/add-category', isAuth.adminAuth, categoryController.addCategory )
router.get( '/edit-category/:id', isAuth.adminAuth, categoryController.getEditCategory )
router.post( '/edit-category', isAuth.adminAuth, categoryController.editCategory )
router.get( '/list-category/:id', isAuth.adminAuth, categoryController.listCategory )
router.get( '/unlist-category/:id', isAuth.adminAuth, categoryController.unlistCategory )

router.get( '/products', isAuth.adminAuth, productController.getProductsList )
router.get( '/add-products', isAuth.adminAuth, productController.getAddProducts )
router.post( '/add-products', isAuth.adminAuth, upload.array('image',4), productController.addProducts )
router.get( '/delete-product/:id', isAuth.adminAuth, productController.deleteProduct )
router.get( '/restore-product/:id', isAuth.adminAuth, productController.restoreProduct )
router.get( '/edit-product/:id', isAuth.adminAuth, productController.getEditProdut )
router.post( '/edit-product', isAuth.adminAuth, upload.array('image',4), productController.editProduct )
router.get( '/delete-image', isAuth.adminAuth, productController.deleteImage )

router.get( '/banner', isAuth.adminAuth, bannerController.getBannerManagement )
router.get( '/add-banner', isAuth.adminAuth, bannerController.getAddBanner )
router.post( '/add-banner', isAuth.adminAuth, upload.single('image'), bannerController.addingBanner )
router.get( '/edit-banner/:id', isAuth.adminAuth, bannerController.getEditBanner )
router.post( '/edit-banner', isAuth.adminAuth, upload.single('image'), bannerController.updateBanner )
router.get( '/delete-banner/:id', isAuth.adminAuth, bannerController.deleteBanner )
router.get( '/restore-banner/:id', isAuth.adminAuth, bannerController.restoreBanner )

router.get( '/orders', isAuth.adminAuth, orderController.getAdminOrderlist )
router.patch( '/change-order-status', isAuth.adminAuth, orderController.changeOrderStatus )
router.get( '/order-products/:id', isAuth.adminAuth, orderController.adminOrderProducts )

router.get( '/coupons', isAuth.adminAuth, couponController.getCoupons )
router.get( '/add-coupon', isAuth.adminAuth, couponController.getAddCoupon )
router.post( '/add-coupon', isAuth.adminAuth, couponController.addCoupon )
router.get( '/edit-coupon/:id' ,isAuth.adminAuth, couponController.getEditCoupon )
router.post( '/edit-coupon', isAuth.adminAuth, couponController.editCoupon )
router.patch( '/cancel-coupon', isAuth.adminAuth, couponController.cancelCoupon )

router.get( '/offers', isAuth.adminAuth, offerController.getOffers )
router.get( '/add-offer', isAuth.adminAuth, offerController.getAddOffer )
router.post( '/add-offer', isAuth.adminAuth, offerController.addOffer )
router.get( '/edit-offer/:id', isAuth.adminAuth, offerController.getEditOffer )
router.post( '/edit-offer', isAuth.adminAuth, offerController.editOffer )
router.patch( '/cancel-offer', isAuth.adminAuth, offerController.cancelOffer )
router.patch( '/apply-product-offer', isAuth.adminAuth, productController.applyProductOffer )
router.patch( '/remove-product-offer', isAuth.adminAuth, productController.removeProductOffer )
router.patch( '/apply-category-offer', isAuth.adminAuth, categoryController.applyCategoryOffer )
router.patch( '/remove-category-offer', isAuth.adminAuth, categoryController.removeCategoryOffer )

router.get( '/sales-report', isAuth.adminAuth, orderController.getSalesReport )



module.exports = router 