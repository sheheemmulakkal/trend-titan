const express = require( 'express' );
const path = require( 'path' );
const mongoose = require( 'mongoose' );
const bodyParser = require( 'body-parser' )

const app = express();

// Getting Routers from the router folder
const shopRouter = require( './routers/shopRouter' );
const authRouter = require( './routers/authRouter');
const adminRouter = require( './routers/adminRouter');
const userRouter = require( './routers/userRouter');

// Using body parser
app.use( bodyParser.urlencoded( {extended : false} ) )

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