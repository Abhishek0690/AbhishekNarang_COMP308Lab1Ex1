const Course = require('../models/Course');

// Create a new course
const createCourse = async (req, res) => {
    try {
        const course = new Course(req.body);
        await course.save();
        res.status(201).send(course);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Get all courses
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({});
        res.status(200).send(courses);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get a course by ID
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).send();
        }
        res.status(200).send(course);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Update a course by ID
const updateCourseById = async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!course) {
            return res.status(404).send();
        }
        res.status(200).send(course);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete a course by ID
const deleteCourseById = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) {
            return res.status(404).send();
        }
        res.status(200).send(course);
    } catch (error) {
        res.status(500).send(error);
    }
};
const getCoursesByStudentId = async (req, res) => {
    try {
        const courses = await Course.find({ student: req.params.studentId });
        res.status(200).send(courses);
    } catch (error) {
        res.status(500).send(error);
    }
};

module.exports = {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourseById,
    deleteCourseById,
    getCoursesByStudentId}