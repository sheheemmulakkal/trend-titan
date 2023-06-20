const express = require( 'express' );
const path = require( 'path' );

const app = express();

// Getting Routers from the router folder
const shopRouter = require( './routers/shopRouter' );
const authRouter = require( './routers/authRouter');
const userRouter = require( './routers/userRouter')



// Setting view engine ( EJS )
app.set('view engine', 'ejs');
app.set('views', 'views');


// Setting static public folder
app.use( express.static( path.join( __dirname, 'public' ) ) )


// Using routers 
app.use ( authRouter );
app.use ( shopRouter );
app.use ( '/user', userRouter );


app.listen( 3000, () => {
    console.log( "Server started successfully" );
})