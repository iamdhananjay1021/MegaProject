const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const crypto = require('crypto');
const bcrypt = require('bcrypt')

// resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
    try {
        // Get email from request body
        const { email } = req.body;

        // Check if the user exists with the provided email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(403).json({
                success: false,
                message: 'Your email is not registered with us',
            });
        }

        // Generate reset token
        const token = crypto.randomUUID();

        // Update user with reset token and expiration time
        await User.findOneAndUpdate(
            { email },
            {
                token,
                resetPasswordExpires: Date.now() + 5 * 60 * 1000, // 5 minutes expiration
            },
            { new: true }
        );

        // Create password reset URL
        const url = `http://localhost:3000/update-password/${token}`;

        // Send email containing the reset link
        await mailSender(email, "Password Reset Link", `Click here to reset your password: ${url}`);

        // Return success response
        return res.json({
            success: true,
            message: "Email sent successfully, please check your email to reset your password.",
        });
    } catch (error) {
        console.error("Error in resetPasswordToken:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
        });
    }
};


// resetPassword

exports.resetPassword = async (req, res) => {
    try {
        // fetch data from req ki body

        const { email, password, confirmPassword } = req.body

        if (password !== confirmPassword) {
            return res.json({
                success: false,
                message: 'Password is not matched',
            })
        }

        // get underdetails from db using token

        const userDetails = await User.findOne({ token: token });
        // if no entry avialable -invalid

        if (!userDetails) {
            return res.json({
                success: false,
                messgae: "Token is invalid"
            })
        }


        // token time check

        if (userDetails.resetPasswordExpires < Date.now()) {
            return res.json({
                success: false,
                message: 'Token is expired, please regenerate your token'
            })
        }

        // hashpassword

        const hasPassword = await bcrypt.hash(password, 10)

        // update the password

        await User.findOneAndUpdate(
            { token: token },
            { password: hasPassword },
            { new: true, }
        );

        return res.status(200).json({
            success: true,
            message: 'Password reset successfully'
        })

    } catch (error) {
        console.error("Error in resetPasswordToken:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
        });
    }
}