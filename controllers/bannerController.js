
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

    }
}