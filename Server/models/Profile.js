const mongoose = require("mongoose")
const profileSchema = new mongoose.Schema({
    gender: {
        type: String,
        // required: true
    },

    dateofBirth: {
        type: String,
        // required: true
    },

    about: {
        type: String,
        // ref: "Course"
        trim:true
    },

    contactNumber: {
        type: Number,
        // reqired:true
        trim:true

    }


})

module.exports = mongoose.model("Profile", profileSchema);
