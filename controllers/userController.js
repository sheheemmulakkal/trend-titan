const mongoose = require( 'mongoose' )
const userSchema = require( '../models/userModel' )
const addressSchema = require( '../models/addressModel' )

module.exports = {

    getUserProfile : async ( req, res ) => {
        try{
            const user = await userSchema.findOne({_id : req.session.user})
            res.render( 'user/profile',{
                user : user
            } )
        }catch(error){
            console.log(error.message);
        }
    },

    getAddAddress : ( req, res ) => {
        res.render( 'user/add-address' )
    },

    addAddress : async ( req, res ) => {
        try {
            const address = new addressSchema({
                fullName:req.body.fullName,
                mobile:req.body.mobile,
                landmark:req.body.landmark,
                street:req.body.street,
                village:req.body.village,
                city:req.body.city,
                pincode:req.body.pincode,
                state:req.body.state,
                country:req.body.country,
                userId : req.session.user
            })
            const result = await address.save()
            const user = await userSchema.updateOne({_id : req.session.user},{
                 $push : { address : result._id}
            })
            res.redirect('/user/address')   
        }catch(error){
            console.log(error.message);
        }
    },

    getAddress : async ( req, res ) => {
        try{
            const user = await userSchema.find({ _id : req.session.user}).populate({
                path: 'address',
                model: 'address',
                match : { status : true}
              })
            //   console.log(user[0].address);
            res.render('user/address',{
                user : user[0],
                address : user[0].address
            })
        } catch ( errror ) {
            console.log(errror.message);
        }
    },

    removeAddress : async ( req, res ) => {
        try {
            const addressId = req.params.id
            const result = await addressSchema.updateOne({_id : addressId},{
                $set : { status : false}
            }) 
            const removeFromUser = await userSchema.updateOne( {_id : req.session.user },{
                $pull : { address : addressId}
            })
            res.status(200).json({success : true})
        } catch (error) {
            console.log(error.message);
        }
    },

    getEditAddress : async( req, res ) => {
        try {
            const addressId = req.params.id 
            const address = await addressSchema.findOne({_id : addressId})
            res.render('user/edit-address', { address : address })
        } catch (error) {
            console.log(error.message);
        }
    },

    editAddress : async ( req, res ) => {
        const addressId = req.body.id
        try {
            const update = await addressSchema.updateOne({_id : addressId},{
                $set : {
                    fullName:req.body.fullName,
                    mobile:req.body.mobile,
                    landmark:req.body.landmark,
                    street:req.body.street,
                    village:req.body.village,
                    city:req.body.city,
                    pincode:req.body.pincode,
                    state:req.body.state,
                    country:req.body.country
                    }
            })
            res.redirect('/user/address')   
        } catch (error) {
            console.log(errror.message);
        }
    },

    editProfile : async ( req, res ) => {
        try {
            const result = await userSchema.updateOne({_id : req.session.user},{
                $set :{ 
                    firstName : req.body.firstName,
                    lastName : req.body.lastName,
                    mobile : req.body.mobile,
                    email : req.body.email,
                } 
            })
            res.json({success : true})
        } catch(error){
            console.log(error.message);
        }
    } 
    
}


 













// {
//     token: { otp: 471279, generatedTime: 2023-06-30T16:03:11.024Z },
//     address: {
//       address1: {
//         _id: new ObjectId("649f02cea0cca98f450fe340"),
//         fullName: 'shheem',
//         mobile: 69656596,
//         landmark: 'malabar',
//         street: 'shheem',
//         village: 'oorakam',
//         city: 'malappuram',
//         pincode: 25652,
//         state: 'KERALA',
//         __v: 0
//       }
//     },
//     _id: new ObjectId("649efcbfccb4904d1b2a242a"),
//     firstName: 'Muhammed ',
//     lastName: 'Sheheen',
//     email: 'shaimonsheheem@gmail.com',
//     mobile: '9207121935',
//     password: '$2a$12$T0QffZO.6lGpM8DLzVnVTebOuAZ8tg78Ldhjn4gjhCKLucOzEJSv2',
//     isAdmin: 0,
//     isVerified: true,
//     isBlocked: false,
//     joinedDate: 2023-06-30T16:03:11.030Z,
//     __v: 0
//   }
//   {
//     mobile: '9207121935',
//     password: '$2a$12$T0QffZO.6lGpM8DLzVnVTebOuAZ8tg78Ldhjn4gjhCKLucOzEJSv2',
//     isAdmin: 0,
//     isVerified: true,
//     isBlocked: false,
//     joinedDate: 2023-06-30T16:03:11.030Z,
//     __v: 0
//   }