const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userNumber: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    program: {
        type: String,
        required: true
    },
    favoriteTopic: {
        type: String,
        required: false
    },
    strongestSkill: {
        type: String,
        required: false
    },
    role: {
    type: String,
    enum: ['student', 'admin'],
    required: true
    }
});

module.exports = mongoose.model('User', userSchema);