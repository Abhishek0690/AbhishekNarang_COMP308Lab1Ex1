const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const courseSchema = new Schema({
    courseCode: {
        type: String,
        required: true
    },
    courseName: {
        type: String,
        required: true
    },
    section: {
        type: String,
    },
    semester: {
        type: String,
    },
    students: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

// Check if the model is already defined before creating it
const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);

module.exports = Course;