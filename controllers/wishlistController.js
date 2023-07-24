const wishlistSchema = require( '../models/wishlistModel')

module.exports = {

    addtToWishlist : async ( req, res ) => {
        try {
            const { productId } = req.body
            const { user } = req.session
            const wishlist = await wishlistSchema.findOne( { userId : user })
            if( wishlist ) {
                const exist = wishlist.products.find( item => item == productId )
                if( exist ){
                    res.json({ message : "Product already exist"})
                } else {
                    await wishlistSchema.updateOne({ userId : user},{
                        $push : {
                            products : productId
                        }
                    })
                    res.json({message : 'Added to wishlist'})
                } 
            } else {
                const newWishlist = new wishlistSchema({
                    userId : user,
                    products : [productId]
                }) 
                await newWishlist.save()
                res.status(200).json({message : "Added to wishlist"})
            }
        } catch (error) {
            console.log(error.message);
        }
    },

    getWishlist : async( req, res ) => {
        try {
            const { user } = req.session
            const list = await wishlistSchema.find({ userId : user}).populate('products')
            res.render( 'user/wishlist' ,{
                list : list
            })
        } catch (error) {
            console.log(error.message);
        }
    },

    removeItem : async ( req, res ) => {
        try {
            const { productId } = req.body
            const { user } = req.session
            await wishlistSchema.findOneAndUpdate({ userId : user },{
                $pull : {
                    products : productId
                }
            })
            const wallet = await wishlistSchema.findOne({ userId : user })
            if ( wallet.products.length === 0 ) {
                await wishlistSchema.deleteOne({ userId : user })
                return res.json({ success : true, listDelete : true})
            }
            res.json({ success : true})
        } catch (error) {
            console.log(error.message);
        }
    }


}