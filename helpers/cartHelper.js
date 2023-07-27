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
                $lookup: {
                  from: "offers",
                  localField: "product.offer",
                  foreignField: "_id",
                  as: "productOffer"
                }
              },
              {
                $unwind: {
                  path: "$productOffer",
                  preserveNullAndEmptyArrays: true
                }
              },
              {
                $lookup: {
                  from: "categories",
                  let: { categoryId: "$product.category" },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ["$_id", "$$categoryId"] }
                      }
                    },
                    {
                      $lookup: {
                        from: "offers",
                        localField: "offer",
                        foreignField: "_id",
                        as: "categoryOffer"
                      }
                    },
                    {
                      $unwind: {
                        path: "$categoryOffer",
                        preserveNullAndEmptyArrays: true
                      }
                    }
                  ],
                  as: "category"
                }
              },
              {
                $unwind: {
                  path: "$category",
                  preserveNullAndEmptyArrays: true
                }
              },
              {
                $addFields: {
                  appliedOffer: {
                    $cond: {
                      if: { $ifNull: ["$productOffer", false] },
                      then: "$productOffer",
                      else: "$categoryOffer"
                    }
                  }
                }
              },
              {
                $addFields: {
                  totalPricePerItem: {
                    $multiply: [
                      "$product.price",
                      {
                        $subtract: [1, { $divide: [{ $ifNull: ["$appliedOffer.percentage", 0] }, 100] }]
                      }
                    ]
                  }
                }
              },
              {
                $addFields: {
                  totalPricePerItem: { $trunc: "$totalPricePerItem" }
                }
              },
              {
                $group: {
                  _id: "$_id",
                  userId: { $first: "$userId" },
                  items: {
                    $push: {
                      _id: "$items._id",
                      productId: "$items.productId",
                      productName: "$product.name",
                      quantity: "$items.quantity",
                      appliedOffer: "$appliedOffer",
                      totalPrice: "$totalPricePerItem" 
                    }
                  },
                  total: { $sum: { $multiply: ["$totalPricePerItem", "$items.quantity"] } } 
                }
              }
            ]);
            return totalPrice

        } catch (error) {
          res.redirect('/500')

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
                        await cartSchema.updateOne({ userId : user, 'items.productId' : items.productId._id},
                        { $set : { 'items.$.quantity' : newQuantity }}) 
                        // if stock quantity is 0 then item will remove from cart
                    } else if ( items && items.productId.quantity < 1) {
                        await cartSchema.updateOne({ userId : user , 'items.productId' : items.productId._id },
                        { $pull : { items : { productId : items.productId._id}}})
                        return 1
                    }
                }
                return 0
            }
        } catch (error) {
          res.redirect('/500')

        }
    }
}
