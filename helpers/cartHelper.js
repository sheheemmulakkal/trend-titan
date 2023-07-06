const cartSchema = require( '../models/cartModel' )
const mongoose = require( 'mongoose')

module.exports = {
    totalCartPrice : async ( user ) => {

        try {
            const totalPrice = await cartSchema.aggregate([
                {
                  $match: { userId: new mongoose.Types.ObjectId(user) }
                },
                {
                  $unwind: "$items"
                },
                {
                  $lookup: {
                    from: "products",
                    localField: "items.productId",
                    foreignField: "_id",
                    as: "product"
                  }
                },
                {
                  $unwind: "$product"
                },
                {
                  $project: {
                    _id: 1,
                    userId: 1,
                    items: {
                      _id: "$items._id",
                      productId: "$items.productId",
                      productName : "$product.name",
                      quantity: "$items.quantity",
                      totalPrice: {
                        $multiply: ["$product.price", "$items.quantity"]
                      }
                    }
                  }
                },
                {
                  $group: {
                    _id: "$_id",
                    userId: { $first: "$userId" },
                    items: { $push: "$items" },
                    total: { $sum: "$items.totalPrice" }
                  }
                }
              ])
              return totalPrice
              
        } catch (error) {
            console.log(error.message);
        }
    },

    updateQuantity : async ( user ) => {

        try {
            const cartItems = await cartSchema.findOne({userId : user }).populate('items.productId');
            // iterating every items in cart
            if( cartItems){
                for ( let items of cartItems.items){
                    
                    // if cart have more quantity than stock the cart qty will reduce to stock quantity
                    if( items && items.productId.quantity > 0 && items.productId.quantity < items.quantity ){
                        newQuantity = items.productId.quantity
                        const item = await cartSchema.updateOne({ userId : user, 'items.productId' : items.productId._id},
                        { $set : { 'items.$.quantity' : newQuantity }}) 
                        // if stock quantity is 0 then item will remove from cart
                    } else if ( items && items.productId.quantity < 1) {
                        const remove = await cartSchema.updateOne({ userId : user , 'items.productId' : items.productId._id },
                        { $pull : { items : { productId : items.productId._id}}})
                        return 1
                    }
                }
                return 0
            }
        } catch (error) {
            console.log(error.message);
        }
    }
}
