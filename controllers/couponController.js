const couponSchema = require( '../models/couponModel' )


module.exports = {
    getCoupons : async ( req, res ) => {
        try {
            const coupons = await couponSchema.find()

            res.render( 'admin/coupons',{
                admin : true,
                coupons : coupons
            })
        } catch (error) {
            console.log(error.message);
        }
    },

    getAddCoupon : ( req, res ) => {

        res.render( 'admin/add-coupon',{
            admin : true,
            err : req.flash('err')
        })
    },

    addCoupon : async ( req, res ) => {
        try {
            const { name, description, startingDate, expiryDate, minimumAmount, discountType, discount } = req.body

            const exist = await couponSchema.findOne({ name : name.toUpperCase()})
            if( exist ){
                console.log('coupon already exist');
                req.flash('err','Coupon name already exist..')
                return res.redirect('/admin/add-coupon')
            }

            const coupon = new couponSchema({
                name : name.toUpperCase(),
                description : description,
                startingDate : startingDate,
                expiryDate : expiryDate,
                minimumAmount : minimumAmount,
                discountType : discountType,
                discount : discount
            })
            await coupon.save()
            res.redirect('/admin/coupons')
        } catch (error) {
            console.log(error.message);
        }
    },

    getEditCoupon : async ( req, res ) => {
        try {
            const { id } = req.params
            const coupon = await couponSchema.findOne({ _id : id })
            res.render( 'admin/edit-coupon',{
                admin : true,
                coupon : coupon
            })
        } catch (error) {
            console.log(error.message);
        }
    },

    editCoupon : async ( req, res ) => {
        try {
            const { name, description, startingDate, expiryDate, minimumAmount, discountType, discount, id } = req.body
            await couponSchema.updateOne({ _id : id }, {
                $set : {
                    name : name.toUpperCase(),
                    description : description,
                    startingDate : startingDate,
                    expiryDate : expiryDate,
                    minimumAmount : minimumAmount,
                    discountType : discountType,
                    discount : discount
                }
            })
            res.redirect('/admin/coupons')
        } catch (error) {
            console.log(error.message);
        }
    },

    cancelCoupon : async ( req, res ) => {
        try {
            const { couponId } = req.body
            await couponSchema.findOneAndUpdate({ _id : couponId },{
                $set : {
                    status : false
                }
            })
            res.json({ cancelled : true })
        } catch (error) {
            console.log(error.message);
        }
    }

    
}