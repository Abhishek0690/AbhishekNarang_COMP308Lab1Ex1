const express = require('express');
const middleware = require('../middleware/middleware');
const { createStudent } = require('../controller/studentController');
const { readAllStudent } = require('../controller/studentController');
const { findStudentId } = require('../controller/studentController');
const { updateStudent } = require('../controller/studentController');
const { deleteStudent } = require('../controller/studentController');
const router = express.Router();

router.post('/students', createStudent, middleware.authenticateToken, middleware.authorizeAdmin);
router.get('/students', middleware.authenticateToken, middleware.authorizeAdmin, readAllStudent);
router.get("/courses/:id/students", findStudentId, middleware.authenticateToken, middleware.authorizeAdmin);

module.exports = router;  