const mongoose = require("mongoose")

const tagSchema = new mongoose.Schema({

    name: {
        type: mongoose.Schema.Types.ObjectId,

    },
    description: {
        type: String,
    },

    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },




})

module.exports = mongoose.model("Tags", tagSchema);