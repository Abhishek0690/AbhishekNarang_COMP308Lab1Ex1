const express = require('express');
const { createCourse } = require('../controller/courseController');
const { getAllCourses } = require('../controller/courseController');
const { getCourseById } = require('../controller/courseController');
const { updateCourseById } = require ('../controller/courseController');
const {deleteCourseById} = require('../controller/courseController');
const router = express.Router();
const middleware = require('../middleware/middleware');
const { getCoursesByStudentId } = require('../controller/courseController');

router.post('/courses', createCourse, middleware.authenticateToken, middleware.authorizeStudent);
router.get('/courses', getAllCourses, middleware.authenticateToken, middleware.authorizeAdmin);
router.patch('/courses/:id', updateCourseById, middleware.authenticateToken, middleware.authorizeStudent);
router.delete('/courses/:id', deleteCourseById, middleware.authenticateToken, middleware.authorizeStudent);
router.get('/students/:studentId/courses', getCoursesByStudentId, middleware.authenticateToken, middleware.authorizeStudent);

module.exports = router;  