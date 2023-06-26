
const { runInNewContext } = require('vm')
const bannerSchema = require( '../models/bannerModel')

module.exports = {

    getBannerManagement : async ( req, res ) => {

        try {
            const banners = await bannerSchema.find()

            res.render( 'admin/banner-management',{
                banners : banners,
                admin : req.session.admin
            })

        } catch(error) {
            console.log(error.message);
        }
        
    },

    getAddBanner : async ( req, res ) => {

        res.render( 'admin/add-banner',{
            admin : req.session.admin
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
                admin : req.session.admin
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
                console.log('hii');
                updatedBanner.image = req.file.filename
            }
    
            const result = await bannerSchema.updateOne({ _id : req.body.bannerId},{
                $set :  updatedBanner 
            })
            res.redirect( '/admin/banner' )
            
        } catch (error) {
            console.log(error.message);
      }
    }
}