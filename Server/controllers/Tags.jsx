const Tag = require('../models/Tags');

// create tag ka handler function

exports.createTag = async (req, res) => {
    try {

        // fetch data from request ki body

        const { name, description } = req.body;

        if (!name || description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // create entry in db

        const tagDetails = await Tag.create({
            name: name,
            description: description,
        });
        console.log(tagDetails)

        return res.status(200).json({
            success: true,
            messgae: "Tags created successfully"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



// get allTag

exports.showAllTags = async (req, res) => {
    try {

        const allTags = await Tag.find({}, { name: true, description: true })
        return res.status(200).json({
            success: true,
            message: "All tags return successfully",
            allTags
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}