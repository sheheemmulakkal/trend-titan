const express = require('express')

const app = express();

// Getting Routers from the router folder
const shopRouter = require( './routers/shopRouter')



app.use ( shopRouter )


app.listen( 3000, () => {
    console.log("Server started successfully");
})