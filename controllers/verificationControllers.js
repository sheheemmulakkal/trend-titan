
const nodemailer = require( 'nodemailer' )
const otpGenerator = require( 'otp-generator' )


const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : 'shaimonsheheem5@gmail.com',
        pass : 'gvyvfoagdfzrqtnh'
    }

});

function generateOtp () {
    const otp =  otpGenerator.generate( 6, {
        upperCaseAlphabets : false,
        lowerCaseAlphabets : false,
        specialChars : false

    })

    return otp
}

module.exports = {

    sendEmail : (email, lastName) => {

        const otp = generateOtp()

        transporter.sendMail({
            to : email,
            from : 'shaimonsheheem5@gmail.com',
            subject : 'Successfully registered',
            html : ` <h1> hey ${lastName}, Your OTP is ${otp}</h1>`
        })

    }

    

}