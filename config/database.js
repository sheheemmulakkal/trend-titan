const mongoose = require('mongoose')
require( 'dotenv' ).config()

module.exports = connection => {
    const databaseURL = process.env.DATABASE_URL

    mongoose.connect(databaseURL)
    .then(()=> {
        console.log('Database connected succesfully');
    })
    .catch(err => {
        console.log(err.message);
        return res.redirect('/500')
    })
}