const Course = require('../models/Course');
const Tag = require('../models/Tags');
const User = require('../models/User');
const { uploadImageToCloudinary } = require('../utils/imageUpload');

// Create Course Handler Function
exports.createCourse = async (req, res) => {
    try {
        const { courseName, courseDescription, whatyouWillLearn, price, tag } = req.body;
        const thumbnail = req.files?.thumbnailImage;

        // Validation
        if (!courseName || !courseDescription || !whatyouWillLearn || !price || !tag || !thumbnail) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Check for Instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);

        if (!instructorDetails) {
            return res.status(404).json({ success: false, message: "Instructor details not found" });
        }

        // Check if given tag is valid
        const tagDetails = await Tag.findById(tag);
        if (!tagDetails) {
            return res.status(404).json({ success: false, message: "Tag details not found" });
        }

        // Upload Image to Cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        // Create New Course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatyouWillLearn,
            price,
            tag: tagDetails._id,
            thumbnail: thumbnailImage.secure_url,
        });

        // Add the new course to the user's courses array
        await User.findByIdAndUpdate(instructorDetails._id, { $push: { courses: newCourse._id } }, { new: true });

        // Update the tag schema to include this course
        await Tag.findByIdAndUpdate(tagDetails._id, { $push: { courses: newCourse._id } }, { new: true });

        return res.status(200).json({
            success: true,
            message: "Course created successfully",
            data: newCourse
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create course",
            error: error.message
        });
    }
};

// Get All Courses Handler Function
exports.showAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find({}, {
            courseName: 1,
            price: 1,
            thumbnail: 1,
            instructor: 1,
            ratingAndReviews: 1,
            studentEnrolled: 1,
        });

        return res.status(200).json({ success: true, data: allCourses });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Cannot fetch course data",
            error: error.message
        });
    }
};
