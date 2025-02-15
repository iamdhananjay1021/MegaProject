const mongoose = require("mongoose")
const courseProgress = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    compleatedVideo: {
        type: String,
        ref: "Course"
    }

})

module.exports = mongoose.model("CourseProgress", courseProgress);
