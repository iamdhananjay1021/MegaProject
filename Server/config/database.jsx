const mongoose = require("mongoose")
require("dotenv").config()

const connect = () => {
    mongoose.connect(process.env.PORT)
        .then(console.log("Data base Connecttion Success"))
        .catch((error) => {
            console.log("Database connection failed")
            console.log(error)
            process.exit(1)
        })
}

module.exports = connect;