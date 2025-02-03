const express = require('express');
const { createStudent } = require('../controller/studentController');
const { readAllStudent } = require('../controller/studentController');
const { findStudentId } = require('../controller/studentController');
const { updateStudent } = require('../controller/studentController');
const { deleteStudent } = require('../controller/studentController');
const router = express.Router();

router.post('/students', createStudent);
router.get('/students', readAllStudent);
router.get('/students/:id', findStudentId);
router.patch('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);


module.exports = router;  