
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

    sendEmail : (email) => {

        const otp = generateOtp()

        transporter.sendMail({
            to : email,
            from : 'shaimonsheheem5@gmail.com',
            subject : 'OTP verification',
            html : ` <h1> hey, Your OTP is ${otp}</h1>`
        })

        return otp

    }

    

}