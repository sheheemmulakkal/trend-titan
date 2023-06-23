const express = require( 'express' );
const path = require( 'path' );
const mongoose = require( 'mongoose' );
const bodyParser = require( 'body-parser' )
const session = require( 'express-session')
const nocache = require( 'nocache' )
const moment = require( 'moment' )


const app = express();

// Getting Routers from the router folder
const shopRouter = require( './routers/shopRouter' );
const authRouter = require( './routers/authRouter');
const adminRouter = require( './routers/adminRouter');
const userRouter = require( './routers/userRouter');
const errorRouter = require( './routers/errorRouter');
const { log } = require('console');

// Using body parser
app.use( bodyParser.urlencoded( {extended : false} ) )

// Using nocache 
app.use( nocache() )

// Session
app.use( session ({

    resave : false,
    secret : 'key',
    saveUninitialized: false

}))

// Date format
const shortDateFormat = "MMM Do YY"

// Middle ware for moment date
app.locals.moment = moment;
app.locals.shortDateFormat = shortDateFormat;


let two = '2023-06-23T15:27:38.469Z'
let one = new Date()

let old = new Date()
console.log( old);
console.log((one - new Date('2023-06-23T15:35:08.624Z')) /1000/60); 


 
// Setting local variable
app.use( ( req, res, next ) => {
    res.locals.userLoggedin = req.session.isLoggedin
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
app.use ( errorRouter );



// Database and server connection
mongoose.connect( 
    'mongodb://127.0.0.1:27017/male-fashion'
)
.then(
    app.listen( 3000, () => {
        console.log( "Server started successfully" );
    })
)
.catch( err => {
    throw err
})