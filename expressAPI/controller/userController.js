const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("../models/user");
const mongoose = require("mongoose");
dotenv.config(); // Load environment variables from .env file

const loginAuth = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("This email is not registered");
      return res.status(400).json({ message: "Invalid credentials" });
    }
    console.log("User found:", user);

    // Check password match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Invalid password");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Sign the JWT and include `userNumber` in the payload
    const jwtToken = jwt.sign(
      { userId: user.userId, userNumber: user.userNumber, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Set the token in the HTTPOnly cookie
    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true in production - mean only send cookie over HTTPS
      sameSite: "none", // Prevent CSRF attacks - only send cookie if the request is coming from the same origin
      maxAge: 3600000, // Cookie will expire after 1 hour
    });

    // Send the user data and token as response
    res.status(200).json({
      user: user,
      token: jwtToken,
    });
  } catch (error) {
    console.log("Error logging in: ", error);
    res.status(500).json({ message: "Server error" });
  }
};
const logoutAuth = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
};

// register admin
const registerAdmin = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
  await mongoose.connection.collection('users').dropIndex('userNumber_1');

console.log("registerAdmin");
  try {
    // Check if the email is already registered
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Create a new admin
    const admin = new User({
      firstName,
      lastName,
      email,
      password,
      role,
    });
    await admin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    console.log("Error registering admin: ", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { loginAuth, logoutAuth, registerAdmin };