


const nodemailer = require( 'nodemailer' )


const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : 'shaimonsheheem5@gmail.com',
        pass : 'gvyvfoagdfzrqtnh'
    }

});

module.exports = {

    sendEmail : (email, lastName) => {

        transporter.sendMail({
            to : email,
            from : 'shaimonsheheem5@gmail.com',
            subject : 'Successfully registered',
            html : ` <h1> hey ${lastName}, You successfully signed up!</h1>`
        })

    }

}