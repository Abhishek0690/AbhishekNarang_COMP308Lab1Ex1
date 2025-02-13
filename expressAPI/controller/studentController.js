const express = require('express');
const Student = require('../models/user');
const Course = require('../models/Course');

const router = express.Router();


// Create a new student
const createStudent = async (req, res) => {
    const token = req.cookies?.token || req.header('Authorization')?.split(' ')[1];
    console.log(req.body);
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).send(student);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Read all students
const readAllStudent = (async (req, res) => {
    const token = req.cookies?.token || req.header('Authorization')?.split(' ')[1];
    try {
        const students = await Student.find({ role: 'student' });
        // if there are no students

        if(students.length === 0) {
            return res.status(404).send({message: "No students"});
        }

        if (!students) {
            return res.status(404).send();}

        res.status(200).send(students);
    } catch (error) {
        res.status(500).send(error);
        
    }
});

// Read a student by ID
const findCourseStudents = async (req, res) => {
    try {
      const courseName = req.params.id; // This will be the course name passed in the URL
  
      // Find the course by course name and populate the students
      const course = await Course.findOne({ courseName: courseName }).populate('students'); // Assuming the course has a 'name' field
  
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      if (course.students.length === 0) {
        return res.status(404).json({ message: 'No students found for this course' });
      }
  
      // Sending back the populated students
      res.status(200).json(course.students); // This will return the list of students in the course
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };
  

// Update a student by ID
const updateStudent = (async (req, res) => {
    const token = req.cookies?.token || req.header('Authorization')?.split(' ')[1];
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'age', 'course'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).send();
        }

        updates.forEach((update) => student[update] = req.body[update]);
        await student.save();
        res.status(200).send(student);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete a student by ID
const deleteStudent = (async (req, res) => {
    const token = req.cookies?.token || req.header('Authorization')?.split(' ')[1];
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).send();
        }
        res.status(200).send(student);
    } catch (error) {
        res.status(500).send(error);
    }
});
module.exports = {
    createStudent,
    readAllStudent,
    findCourseStudents,
    updateStudent,
    deleteStudent
  };
  