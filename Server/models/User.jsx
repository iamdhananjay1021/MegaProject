const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: true,

    },

    lastName: {
        type: String,
        trim: true,
        required: true,

    },

    email: {
        type: String,
        trim: true,
        required: true,

    },

    password: {
        type: String,
        required: true
    },

    accountType: {
        type: String,
        enum: ["Admin", "Student", "Instructor"],
        required: true,
    },

    additionalDeatials: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile"
    },
    Course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },
    image: {
        type: String,
        required: true
    },

    token: {
        type: String
    },

    resetPasswordExpires: {
        type: Date,
    },


    courseProgress: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CourseProgress"
        }
    ]



})

module.exports = mongoose.model("User", userSchema);