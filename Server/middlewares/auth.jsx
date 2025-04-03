const user = require('../models/User')

// auth

exports.auth = async (req, res, next) => {
    try {

        const token = req.cookies.token
            || req.body.token
            || req.header("Authorization").replace("Bearer", "")

        // if token missing, then return response

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            })
        }

        // verifying the token

        try {
            const decode = await jwt.veryfy(token, process.env.JWT_SECRET)
            console.log(decode)
            req.user = decode;
        } catch (error) {
            // verification issue
            return res.status(401).json({
                success: false,
                message: "token is invalid"
            })
        }
        next();

    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Something went wrong while validating the token  "
        })
    }
}



// isStudent

exports.isStudent = async (req, res, next) => {

    try {

        if (req.user.accountType !== "Student") {
            return res.json(401).json({
                success: false,
                message: "This is Protected route for the student"
            })
        }
        next()

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "User role can not be verified, please try again"
        })

    }

}

// Instructor 

exports.isInstructor = async (req, res, next) => {
    try {

        if (req.user.accountType !== "Instructor") {
            return res.json(401).json({
                success: false,
                message: "This is Protected route for the Instructor"
            })
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Instructor role can not be verified, please try again"
        })

    }
}

// isAdmin

exports.isAdmin = async (req, res, next) => {
    try {

        if (req.user.accountType !== "Admin") {
            return res.json(401).json({
                success: false,
                message: "This is Protected route for the Admin"
            })
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Admin role can not be verified, please try again"
        })

    }
}