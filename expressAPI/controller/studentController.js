const express = require('express');
const Student = require('../models/student');

const router = express.Router();

// Create a new student
const createStudent = async (req, res) => {
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
const readAllStudent =(async (req, res) => {
    try {
        const students = await Student.find({});
        res.status(200).send(students);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Read a student by ID
const findStudentId = (async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).send();
        }
        res.status(200).send(student);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update a student by ID
const updateStudent = (async (req, res) => {
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
    findStudentId,
    updateStudent,
    deleteStudent
  };
  