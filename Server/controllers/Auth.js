const User = require("../models/User")
const OTP = require("../models/OTP")
const otpGenerator = require("otp-generator")
// SendOtp

exports.sendOTP = async (req, res) => {
    try {

        // fetch emai from request ki body
        const { email } = req.body;

        // check if user allready exist
        const checkUserPresent = await User.findOne({ email });

        // if user allready allready exist , then return a message 

        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User allready registered"
            })
        }

        var otp = otpGenerator.generate(6, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        })

        console.log("OTP Generated", otp);

        let result = await OTP.findOne({otp:otp})


    } catch (error) {

    }
}






// Signup

// login



// ChangePass