const jwt = require('jsonwebtoken');
const User = require('../models/user');  // Assuming you have a User model
const Student = require('../models/student'); // Assuming the student data is in this model
const secretKey = "z2h8V!G7h3sN8$TzWqL5zRk2yFkG9uE0P4eX2y1kBcV7zR!mQzX8"; // Your secret key for signing JWT
// Middleware to check if the user is a student
const isStudent = (req, res, next) => {
  if (req.user.role !== 'Student') {
    return res.status(403).send("Access Denied. You are not a student.");
  }
  next();
};

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).send("Access Denied. You are not an admin.");
  }
  next();
};
// Authentication Middleware - Verifies if the user is logged in (JWT token)
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Extract token from Authorization header
  
  if (!token) {
    return res.status(403).send("Access Denied. No Token Provided.");
  }

  // Verify token and extract user details
  jwt.verify(token, secretKey, async (err, user) => {
    if (err) {
      return res.status(403).send("Invalid Token");
    }
    
    // Attach user info to request object for later use
    req.user = user;
    next();
  });
};

// Authorization Middleware - Verifies if the user has the correct role
const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).send("You do not have the necessary permissions to access this resource.");
    }
    next();
  };
};

// Student Specific Access Control
const authorizeStudent = (req, res, next) => {
  if (req.user.role !== 'Student') {
    return res.status(403).send("You are not authorized to perform student actions.");
  }
  next();
};

// Admin Specific Access Control
const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).send("You do not have admin privileges to perform this action.");
  }
  next();
};

// Check if the user is the same as the student they are modifying
const checkStudentOwnership = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("Student not found");
    }
    
    // Check if the logged-in student matches the student in the URL (for update/delete operations)
    if (user._id.toString() !== req.user.id) {
      return res.status(403).send("You do not have permission to modify this student.");
    }

    next();
  } catch (error) {
    res.status(500).send(error);
  }
};

// Export the middleware functions
module.exports = {
  authenticateToken,
  authorizeRole,
  authorizeStudent,
  authorizeAdmin,
  checkStudentOwnership
};
