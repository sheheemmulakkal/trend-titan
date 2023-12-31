//Database connection
require('./config/database')()
require( 'mongoose' );
require( 'dotenv' ).config()
const express = require( 'express' );
const path = require( 'path' );
const flash = require( 'connect-flash' )
const session = require( 'express-session' )
const nocache = require( 'nocache' )
const moment = require( 'moment' )


const app = express();

// Getting Routers from the router folder
const shopRouter = require( './routers/shopRouter' );
const authRouter = require( './routers/authRouter'); 
const adminRouter = require( './routers/adminRouter');
const userRouter = require( './routers/userRouter');
const errorRouter = require( './routers/errorRouter');
const errorController = require( './controllers/errorController' )
    
app.use( express.json())
app.use( express.urlencoded({ extended: false }))


// Using nocache 
app.use( nocache() )

// Session

app.use( session ({

    resave : false,
    secret : process.env.KEY,
    saveUninitialized: false
    
}))

// Using connect-flash message
app.use(flash())



// Date format
const shortDateFormat = "MMM Do YY"

// Middle ware for moment date
app.locals.moment = moment;
app.locals.shortDateFormat = shortDateFormat;


// Setting local variable
app.use( ( req, res, next ) => {
    res.locals.userLoggedin = req.session.user
    if( req.session.productCount ){
        res.locals.productCount = req.session.productCount
    } else {
        res.locals.productCount = 0
    }
    next()
})



// Setting view engine ( EJS )
app.set('view engine', 'ejs');
app.set('views', 'views');
 

// Setting static public folder
app.use( express.static( path.join( __dirname, 'public' ) ) )



// Using routers 
app.use ( authRouter );
app.use ( shopRouter );
app.use ( '/admin', adminRouter );
app.use ( '/user', userRouter );
app.use ( '/500', errorController.get500 )
app.use ( errorController.get404 );


app.listen( process.env.PORT || 3000 , () => {
    console.log( "Server started successfully" );
}) 