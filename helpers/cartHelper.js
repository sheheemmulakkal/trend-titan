const cartSchema = require( '../models/cartModel' )
const mongoose = require( 'mongoose')

module.exports = {
    totalCartPrice : async ( user ) => {
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
    }
}
