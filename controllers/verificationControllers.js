const { v4 : uuidv4 } = require( 'uuid' )
const nodemailer = require( 'nodemailer' )
const otpGenerator = require( 'otp-generator' )
require( 'dotenv' ).config()


const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : process.env.USER_MAIL,
        pass : process.env.PASS
    }

});

function generateOtp () {
    try {
        const otp =  otpGenerator.generate( 6, {
            upperCaseAlphabets : false,
            lowerCaseAlphabets : false,
            specialChars : false
    
        })
        return otp
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {

    sendEmail : (email) => {
        try {
            const otp = generateOtp()
            console.log(otp);
            transporter.sendMail({
                to : email,
                from : process.env.USER_MAIL,
                subject : 'OTP verification',
                html : ` <h1> hey, Your OTP is ${otp}</h1><br>
                <p> Note : The OTP only valid for 1 hour!!! </p>
                `
            })

            return otp
        } catch (error) {
            console.log(error.message);
        }

    },

    referralCodeGenerator : () => {
        // Referral code
      
        // Function to generate a random alphanumeric code
        function generateRandomCode(length) {
            const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let randomCode = '';
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * charset.length);
                randomCode += charset[randomIndex];
            }
            return randomCode;
        }

        // Generate a unique user ID (for example, using UUID)
        const uniqueUserId = uuidv4();

        // Generate a short alphanumeric referral code (6 characters)
        const referralCode = generateRandomCode(6);

        // Combine user ID and referral code to create the referral ID
        const referralId = `${uniqueUserId}-${referralCode}`;

        return referralId

    }
    

}