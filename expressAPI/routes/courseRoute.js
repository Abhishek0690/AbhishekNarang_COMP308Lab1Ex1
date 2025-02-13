const express = require('express');
const Course = require('../models/Course');
const { createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse, getCourseByStudentId } = require('../controller/courseController');
const { authenticateToken, authorizeStudent } = require('../middleware/middleware');
const router = express.Router();

router.use(authenticateToken);
router.use(authorizeStudent);

router.post('/add-course', createCourse);
router.get('/courses/:id', getCourseByStudentId);
router.get('/all-courses', getAllCourses);
router.patch('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse); 

module.exports = router;