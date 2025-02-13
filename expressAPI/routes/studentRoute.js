const express = require('express');
const { authorizeAdmin,
    authenticateToken
 } = require('../middleware/middleware');
const {
    loginAuth,
    registerAdmin
} = require('../controller/userController');
const { createStudent } = require('../controller/studentController');
const { readAllStudent } = require('../controller/studentController');
const { findCourseStudents } = require('../controller/studentController');
const { getAllCourses } = require('../controller/courseController');
const { deleteCourse } = require('../controller/courseController');


const router = express.Router();

router.post('/login',  loginAuth)

router.post('/add-students', authenticateToken, authorizeAdmin, createStudent);
router.get('/all-students', authenticateToken, authorizeAdmin, readAllStudent);
router.get('/all-admin-courses',authenticateToken, authorizeAdmin, getAllCourses);
router.delete('/courses-admin/:id', deleteCourse);
router.get("/courses/:id/students", authenticateToken, authorizeAdmin, findCourseStudents);

// register admin
router.post('/register-admin', registerAdmin);
module.exports = router;  


