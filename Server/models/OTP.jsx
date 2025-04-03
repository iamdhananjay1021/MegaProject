const mongoose = require("mongoose")

const OTPSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,

    },
    otp: {
        type: String,
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60
    },


})

// A function to send email

async function sendVerificationMail(email, otp) {
    try {

        const mailResponse = await mailSender(email, "Verification email from StudyNotion", otp)
        console.log("Email sent Successfully", mailResponse)
        log

    } catch (error) {
        console.log("error occured while sending the mails", error);
        throw error;

    }

}
OTPSchema.pre("save", async function (next) {
    await sendVerificationMail(this.email, this.otp)
    next()
})

module.exports = mongoose.model("OTP", OTPSchema);