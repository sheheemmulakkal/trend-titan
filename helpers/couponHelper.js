const couponSchema = require( '../models/couponModel' )

module.exports = {

    discountPrice : async ( couponId, cartTotal ) => {
        const coupon = await couponSchema.findById(couponId);
        if (!coupon) {
            return {
            discountAmount: 0,
            discountedTotal: cartTotal
            };
        }
        let discountAmount = 0;
        if (coupon.discountType === "percentage") {
            discountAmount = (coupon.discount / 100) * cartTotal;
        } else if (coupon.discountType === "fixed-amount") { 
            discountAmount = coupon.discount;
        }
        // Calculate the discounted total
        const discountedTotal = cartTotal - discountAmount;
        return { discountAmount, discountedTotal }
    }      
}