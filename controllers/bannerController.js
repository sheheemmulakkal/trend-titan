
const bannerSchema = require( '../models/bannerModel' )
const paginationHelper = require( '../helpers/paginationHelper' )

module.exports = {

    getBannerManagement : async ( req, res ) => {

        try {
            let page = Number(req.query.page);
            if (isNaN(page) || page < 1) {
            page = 1;
            }
            const bannersCount = await bannerSchema.find().count()
            const banners = await bannerSchema.find()
            .skip(( page - 1 ) * paginationHelper.BANNER_PER_PAGE ).limit( paginationHelper.BANNER_PER_PAGE )

            res.render( 'admin/banner-management',{
                banners : banners,
                admin : req.session.admin,
                success : req.flash('success'),
                currentPage : page,
                hasNextPage : page * paginationHelper.BANNER_PER_PAGE < bannersCount,
                hasPrevPage : page > 1,
                nextPage : page + 1,
                prevPage : page -1,
                lastPage : Math.ceil( bannersCount / paginationHelper.BANNER_PER_PAGE )
            })

        } catch(error) {
            console.log(error.message);
        }
        
    },

    getAddBanner : async ( req, res ) => {

        res.render( 'admin/add-banner',{
            admin : req.session.admin,
            success : req.flash('success')
        })
    },

    addingBanner : async( req, res ) => {

        try {

            const banner = new bannerSchema({
                mainHead : req.body.mainHead,
                typeHead : req.body.type,
                description : req.body.description,
                image : req.file.filename
            })
            await banner.save()
            req.flash('success','Banner Added Succussfully...')
            res.redirect( '/admin/banner' )
            
        } catch (error) {
            console.log(error.message);
        }
    },

    getEditBanner : async( req, res ) => {

        try {
            
            const banner = await bannerSchema.findById(req.params.id)
            res.render( 'admin/edit-banner',{
                banner : banner,
                admin : req.session.admin,
                err : req.flash('err'),
                success : req.flash('success')
            } ) 

        } catch (error) {
            console.log(error.message);
        }
    },

    updateBanner : async ( req, res ) => {

        try {

            const updatedBanner = {
                mainHead : req.body.mainHead,
                typeHead : req.body.type,
                description : req.body.description
            }
            if( req.file ){
                    if(     
                        file.mimetype !== 'image/jpg' &&
                        file.mimetype !== 'image/jpeg' &&
                        file.mimetype !== 'image/png' &&
                        file.mimetype !== 'image/gif'
                        ){
                            req.flash('err','Check the image type')
                            return res.redirect(`/admin/edit-banner/${bannerId}`)
                        }
                updatedBanner.image = req.file.filename
            }
            await bannerSchema.updateOne({ _id : req.body.bannerId},{
                $set :  updatedBanner 
            })
            req.flash('success','Banner Updated')
            res.redirect( '/admin/banner' )

        } catch (error) {
            console.log(error.message);
      }
    },

    deleteBanner : async ( req, res ) => {
        try {

            await bannerSchema.updateOne({ _id : req.params.id },{ status : false })
            res.redirect('/admin/banner')
            
        } catch (error) {
            console.log(error.message);
        }
    },

    restoreBanner : async ( req, res ) => {
        try {

            await bannerSchema.updateOne({ _id : req.params.id },{ status : true })
            res.redirect('/admin/banner')
            
        } catch (error) {
            console.log(error.message);
        }
    }
}