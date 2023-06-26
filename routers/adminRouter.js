const express = require( 'express' )
const path = require( 'path' )

const authController = require( '../controllers/authController' )
const adminController = require( '../controllers/adminController')
const productController = require( '../controllers/productController')
const categoryController = require('../controllers/categoryController')
const bannerController = require( '../controllers/bannerController')
const isAuth = require ( '../middleware/isAuth')

const multer = require('multer')

const router = express.Router()


// Setting up multer
const storage = multer.diskStorage({
    destination : ( req, file, cb ) => {
        cb( null, path.join( __dirname, '../public/images/product-images' ))
    },
    filename : ( req, file, cb ) => {
        const uniqueName = Date.now() + '-' + file.originalname
        cb( null, uniqueName )
    }
})

const upload = multer({storage : storage})


// Routes 

router.get( '/login', isAuth.adminLoggedOut,  authController.getAdminLogin )

router.post( '/login', isAuth.adminLoggedOut, authController.doAdminLogin )

router.get( '/logout', isAuth.adminAuth, authController.doAdminLogout )

router.get( '/userList', isAuth.adminAuth, adminController.getUserList )

router.get( '/', isAuth.adminAuth, adminController.getAdminHome )

router.get( '/block-user/:id', isAuth.adminAuth, adminController.blockUser )

router.get( '/unblock-user/:id', isAuth.adminAuth, adminController.unBlockUser )

router.get( '/category', isAuth.adminAuth, categoryController.getCategory )

router.post( '/add-category', isAuth.adminAuth, categoryController.addCategory )

router.get( '/edit-category/:id', isAuth.adminAuth, categoryController.getEditCategory )

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


module.exports = router 