const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Course = require('../models/Course');
dotenv.config();

// Create a new course
const createCourse = async (req, res) => {
    try {
        // Extract token from the request header
        const token = req.cookies?.token || req.header('Authorization')?.split(' ')[1];
        console.log("req.body", req.body);

        if (!token) {
            return res.status(401).json({ message: 'Authentication token is missing' });
        }

        // Verify and decode the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log("decodedToken", decodedToken);

        // Ensure userNumber or userId exists in the decoded token
        const userId = req.body.id ;
        if (!userId) {
            return res.status(401).json({ message: 'User identification missing in token' });
        }
        console.log("userId", userId);

        // Retrieve course data from request body
        const { courseCode, courseName, section, semester } = req.body;

        // Create a new course, adding the authenticated user as a student
        const course = new Course({
            courseCode,
            courseName,
            section,
            semester,
            students: [userId] // Adding user as a student in the course
        });

        // Save the course to the database
        await course.save();
        res.status(201).json({ message: 'Course created successfully', course });
        console.log("Decoded Token", decodedToken);

    } catch (error) {
        console.error("Error creating course: ", error);
        res.status(500).json({ message: 'Error creating course', error });
    }
};

const getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find();
    if (allCourses) {
      res.status(200).json(allCourses);
    } else {
      res.status(404).json({ message: "No courses found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get a course by ID
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findOne({ students : req.params.id });
        if (!course) {
            return res.status(404).send();
        }
        res.status(200).send(course);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Update a course by Name
const updateCourse = async (req, res) => {
    try {
        const courseName = req.params.id;
        const { newCourseName, newCourseCode } = req.body;
        console.log(`Updating course: ${courseName} to new name: ${newCourseName} and new code: ${newCourseCode}`);
        const updateCourse = await Course.findOneAndUpdate(
          { courseName },
          { courseName: newCourseName, courseCode: newCourseCode },
          { new: true }
        );
        if (updateCourse) {
          res.status(200).json({ message: "Course updated successfully", updateCourse });
        } else {
          res.status(404).json({ message: "Course not found" });
        }
      } catch (error) {
        console.error("Error updating course: ", error);
        res.status(500).json({ message: error.message });
      }
};

// Delete a course by Name
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findOneAndDelete({ courseName: req.params.id });
        if (!course) {
            return res.status(404).send();
        }
        res.status(200).send(course);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get courses by student ID

const getCourseByStudentId = async (req, res) => {
    try {
      const studentId = req.params.id;
      console.log(studentId)
      // Find courses and populate students to access student details
      const courses = await Course.find({ students: studentId }).populate({
        path: "students",
        select: "_id",
      });
  
      if (courses.length > 0) {
        res.status(200).json(courses);
      } else {
        res.status(404).json({ message: "No courses found for this student" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

module.exports = {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    getCourseByStudentId
};
