
const nodemailer = require( 'nodemailer' )
const otpGenerator = require( 'otp-generator' )
const dotenv = require( 'dotenv' ).config()


const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : process.env.USER_MAIL,
        pass : process.env.PASS
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
            from : process.env.USER_MAIL,
            subject : 'OTP verification',
            html : ` <h1> hey, Your OTP is ${otp}</h1><br>
            <p> Note : The OTP only valid for 1 hour!!! </p>
            `
        })

        return otp

    }

    

}