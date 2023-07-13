

const Razorpay = require('razorpay');

const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env
// Razorpay
var instance = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });


module.exports = {
    razorpayPayment : async ( orderId, totalPrice ) => {
        const id = ""+orderId
        const order = await instance.orders.create({
            amount: totalPrice*100,
            currency: "INR",
            receipt: id
        })
          return order
    }
}
