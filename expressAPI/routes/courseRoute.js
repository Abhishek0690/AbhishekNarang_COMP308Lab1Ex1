const express = require('express');
const { createCourse } = require('../controller/courseController');
const { getAllCourses } = require('../controller/courseController');
const { getCourseById } = require('../controller/courseController');
const { updateCourseById } = require ('../controller/courseController');
const {deleteCourseById} = require('../controller/courseController');
const router = express.Router();

router.post('/courses', createCourse);
router.get('/courses', getAllCourses);
router.get('/courses/:id', getCourseById);
router.patch('/courses/:id', updateCourseById);
router.delete('/courses/:id', deleteCourseById);

module.exports = router;  