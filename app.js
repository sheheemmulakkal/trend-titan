const express = require( 'express' );
const path = require( 'path' );

const app = express();

// Getting Routers from the router folder
const shopRouter = require( './routers/shopRouter' );


// Setting view engine ( EJS )
app.set('view engine', 'ejs');
app.set('views', 'views');



// Using routers 
app.use ( shopRouter );


app.listen( 3000, () => {
    console.log( "Server started successfully" );
})