const mongoose = require("mongoose")
const courseSchema = new mongoose.Schema({
    courseName: {
        type: String
    },
    courseDescription: {
        type: String
    },
    isInstructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" 
    },
    whatyouWillLearn: {
        type: String
    },

    courseContent: [
        {
            type: String,
            ref: "Section"
        },
    ],

    ratingAndReviews: [
        {
            type: String,
            ref: "RatingAndReviews"
        },
    ],

    price: {
        type: Number,
    },
    thumbnail: {
        type: String
    },
    tag: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tags"
    },

    studentEnrolled: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },


})

module.exports = mongoose.model("Course", courseSchema)