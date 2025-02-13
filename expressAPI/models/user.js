const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userNumber: {
        type: String,
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
        
    },
    city: {
        type: String,
       
    },
    phoneNumber: {
        type: String,
       
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    program: {
        type: String,
       
    },
    favoriteTopic: {
        type: String,
       
    },
    strongestSkill: {
        type: String,
       
    },
    role: {
    type: String,
    enum: ['student', 'admin'],
    required: true
    }
});

// hash the password before saving it to the database
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) { // if the password is modified - hash it
        user.password = await bcrypt.hash(user.password, 8);
    }
    // else - do nothing and move to the next middleware
    next();
});


module.exports = mongoose.model('User', userSchema);