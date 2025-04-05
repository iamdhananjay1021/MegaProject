const Section = require('../models/Section')
const Course = require('../models/Course')

const createSection = async (req, res) => {
    try {
        // fetch data
        const { sectionName, courseId } = req.body;

        // Validation
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Missing Properties"
            })
        }

        // Create Section

        const newSection = await Section.create({ sectionName })

        // update course with section objectId

        const updateCourseDetails = await Course.findByIdAndUpdate(courseId,
            {

                $push: {
                    courseContent: newSection._id
                }
            },
            { new: true },
        );
        return res.status(200).json({
            success: true,
            message: "Section created Successfully",
            updateCourseDetails
        })


    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Unable to create section please try again ",
            error: error.message
        });

    }
}