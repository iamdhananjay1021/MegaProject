const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.sendOTP = async (req, res) => {
    try {
        // Fetch email from request body
        const { email } = req.body;

        // Validate email presence
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        // Check if user already exists
        const checkUserPresent = await User.findOne({ email });

        // If user already exists, return a message
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User already registered"
            });
        }

        // Generate unique OTP
        let otp;
        let result;
        do {
            otp = otpGenerator.generate(6, {
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false
            });
            result = await OTP.findOne({ otp: otp });
        } while (result); // Keep generating until we get a unique OTP

        // Create OTP entry in database
        const otpPayload = { email, otp };
        const otpEntry = await OTP.create(otpPayload);
        console.log(otpEntry)

        // Return success response
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp: otp
        });

    } catch (error) {
        console.error("Error in sendOTP:", error);
        return res.status(500).json({
            success: false,
            message: "Error generating OTP",
            error: error.message
        });
    }
};


// Signup 

exports.signUp = async (req, res) => {
    try {

        // data fetch from request ki body
        const {

            firstName,
            lastName,
            email,
            contactNumber,
            password,
            confirmPassword,
            accountType,
            otp
        } = req.body;

        // validate karlo

        if (!firstName || !lastName || !email || !contactNumber || !password || !confirmPassword || !otp) {
            res.status(403).json({
                success: false,
                messgae: "All fields all required"
            })


            // Password match karlo

            if (password !== confirmPassword) {
                res.status(40).json({
                    success: false,
                    messgae: "Password and confirm password value can not be matched,Please try again"
                })
            }

            // check user allready exists 

            const existingUser = await User.findOne({ email });

            if (existingUser) {
                res.status(400).json({
                    success: false,
                    message: "User is allready registered"
                })
            }

            // find the most recent otp stored for the user

            const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
            console.log(recentOtp)

            // validate otp 

            if (recentOtp.length == 0) {
                res.status(400).json({
                    success: false,
                    message: "Otp not found"
                })
            } else if (otp !== recentOtp.otp) {
                res.status(400).json({
                    success: false,
                    message: "Invalid Otp"
                })
            }

            // Haspassword

            const hashedPassword = await bcrypt.hash(password, 10);

            // entry create in db

            const profileDetails = await Profile.create({
                gender: null,
                dateOfBirth: null,
                about: null,
                contactNumber: null,

            })

            const user = await User.create({
                firstName,
                lastName,
                email,
                contactNumber,
                password: hashedPassword,

                accountType,
                additionalDeatials: profileDetails._id,
                image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
            })

            return res.status(200).json({
                success: true,
                message: "User registered successfully"
            })


        }

    } catch (error) {

        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again"
        })

    }
}



// signIn

exports.login = async (req, res) => {
    try {

        // Get data from the request ki body
        const { email, password } = req.body;

        // validate karwalo 
        if (!email || password) {
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            })


        }

        // User check exits or not 
        const user = await User.findOne({ email }).populate("additionalDetails");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User is not registered, please signup first'
            })

        }
        // generate JWT after password matching
        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            })
            user.token = token;
            user.password = undefined;


            // Create cookie and send the response 
            const options = {
                expires: new Date.now() + 3 * 24 * 60 * 60 * 100,
                httpOnly: true,
            }

            res.cookie('token', token, options).status(200).json({
                success: true,
                message: "logged in successfully",
                token,
                user,
            })
        } else {
            return res.status(401).json({
                success: false,
                message: "Password id incorrect "
            })
        }



    } catch (error) {

        console.log(error);
        return res.status(500).json({
            success: false,
            messgae: "Login failure, please try again"
        })

    }
}