const couponSchema = require( '../models/couponModel' )


module.exports = {
    getCoupons : async ( req, res ) => {
        try {
            const { search, sortData, sortOrder  } = req.query
            const condition = {}

            if ( search ){
                condition.$or = [
                    { name : { $regex : search, $options : "i" }},
                    { description : { $regex : search, $options : "i" }},
                    { discountType : { $regex : search, $options : "i" }},
                    
                ]
            }
            const sort = {}
            if( sortData ) {
                if( sortOrder === "Ascending" ){
                    sort[sortData] = 1
                } else {
                    sort[sortData] = -1
                }
            }
            

            const coupons = await couponSchema.find( condition ).sort( sort )
            res.render( 'admin/coupons',{
                admin : true,
                coupons : coupons,
                search : search
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
                discount : discount,
                sortData : sortData,
                sortOrder : sortOrder
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
    },

    applyCoupon : async ( req, res ) => {
        try {
            const { couponCode } = req.body
            const { user } = req.session

            const coupon = await couponSchema.find({ name : couponCode, status : true })

            
            if( coupon && coupon.length > 0 ) {

                console.log(1);
                const now = new Date()
                if( coupon[0].expiryDate >= now && coupon[0].startingDate <= now ){

                    console.log(2);
                    const userExist = coupon[0].users.some( userId  => userId.toString == user )
                    if( userExist ){

                        console.log(4);
                        res.status(409).json({ success : false, message : 'Coupon already used by the user' })
                    } else {

                        
                        res.json({ success : true, message : "Available"  })
                    }
                } else {

                    console.log(6);
                    res.json({ success : false, message : 'Invalid Coupon, out dated'})
                }
            } else {

                console.log(7);
                res.json({ success : false, message : 'Invalid Coupon'})
            } 
             
            
        } catch (error) {
            console.log(error.message);
        }
    }

    
}