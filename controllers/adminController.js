

const userSchema = require( '../models/userModel' )
const orderSchema = require( '../models/orderModel' )
const productSchema = require( '../models/productModel' )
const paginationHelper = require( '../helpers/paginationHelper' )
const dashboardHelper = require( '../helpers/dashboardHelpers' )






module.exports = {
    
    getAdminHome : async( req, res ) => {
        
        try {
            const today = new Date();
            today.setHours( 0, 0, 0, 0 )
            const yesterday = new Date(today)
            yesterday.setDate( today.getDate() - 1 );
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth();
            const currentMonthStartDate = new Date(currentYear, currentMonth, 1, 0, 0, 0);
            const previousMonthStartDate = new Date(currentYear, currentMonth - 1, 1, 0, 0, 0);
            const previousMonthEndDate = new Date(currentYear, currentMonth, 0, 23, 59, 59);
            
            
            const promises = [
                dashboardHelper.currentMonthRevenue( currentMonthStartDate, now ),
                dashboardHelper.previousMonthRevenue( previousMonthStartDate, previousMonthEndDate ),
                dashboardHelper.paymentMethodAmount(),
                dashboardHelper.todayIncome( today, now ),
                dashboardHelper.yesterdayIncome( today, yesterday ),
                dashboardHelper.totalRevenue(),
                orderSchema.find({ orderStatus : "Confirmed" }).count(),
                orderSchema.find({ orderStatus : "Delivered" }).count(),
                userSchema.find({isBlocked : false, isVerified : true}).count(),
                productSchema.find({status : true}).count()
            ]
            
            const results = await Promise.all( promises )

            const revenueCurrentMonth = results[0]
            const revenuePreviousMonth = results[1]
            const paymentMethodAmount = results[2]
            const todayIncome = results[3]
            const yesterdayIncome = results[4]
            const totalRevenue = results[5]
            const ordersToShip = results[6]
            const completedOrders = results[7]
            const userCount = results[8]
            const productCount = results[9]

            const monthlyGrowth = revenuePreviousMonth === 0 ? 100 : ((( revenueCurrentMonth - revenuePreviousMonth ) / revenuePreviousMonth ) * 100).toFixed(1);

            const dailyGrowth = ((( todayIncome - yesterdayIncome ) / yesterdayIncome ) * 100).toFixed( 1 )  
            res.render( 'admin/dashboard', {
                admin : req.session.admin,
                todayIncome : todayIncome,
                dailyGrowth : dailyGrowth,
                totalRevenue : totalRevenue,
                revenueCurrentMonth : revenueCurrentMonth,
                monthlyGrowth : monthlyGrowth,
                paymentMethodAmount : paymentMethodAmount,
                userCount : userCount,
                ordersToShip : ordersToShip,
                completedOrders : completedOrders,
                productCount : productCount
            } )
        } catch (error) {
            console.log(error.message);
        }

    },

    getUserList : async( req, res ) => {

        try {
            let page = Number(req.query.page);
            if (isNaN(page) || page < 1) {
            page = 1;
            }
            const userCount = await userSchema.find({ isAdmin : 0 }).count()
            const userList = await userSchema.find({ isAdmin : 0 })
            .skip(( page - 1 ) * paginationHelper.USERS_PER_PAGE ).limit( paginationHelper.USERS_PER_PAGE )

            res.render( 'admin/userList', {
                userList : userList,
                admin : req.session.admin,
                currentPage : page,
                hasNextPage : page * paginationHelper.USERS_PER_PAGE < userCount,
                hasPrevPage : page > 1,
                nextPage : page + 1,
                prevPage : page -1,
                lastPage : Math.ceil( userCount / paginationHelper.USERS_PER_PAGE ) 
            } )
            
        } catch ( error ) {
            console.log( error.message );
        }

    },

    blockUser : async ( req, res ) => {

        try {
            const userId = req.params.id
            const userData = await userSchema.findById( userId )
            await userData.updateOne({ $set : { isBlocked : true }})

            // Checks if the user is in same browser 
            if( req.session.user === userId ){
                // If user is in same browser it deletes 
                delete req.session.user
            }
            
            const sessions = req.sessionStore.sessions;
            for ( const sessionId in sessions ) {
            const session = JSON.parse( sessions[sessionId] );
            if ( session.user === userId ) {
                delete sessions[sessionId];
                break; 
            }
            }
            
            res.json( { success : true } )
            
        } catch ( error ) {
            console.log( error.message );
        }
       
    },

    unBlockUser : async ( req, res ) => {
        try {
            
            const userId = req.params.id
            const userData = await userSchema.findById( userId )
            await userData.updateOne({ $set : { isBlocked : false }})

            res.json( { success : true } )

        } catch ( error ) {
            console.log( error.message );
        }
    }


}