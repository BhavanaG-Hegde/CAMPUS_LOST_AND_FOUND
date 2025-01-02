require('dotenv').config({ path: '../.env' });
const express = require("express");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../server/models/user");
const verifyToken = require("../server/middleware/auth");
const router = express.Router();

router.get("/protected", verifyToken, async (req, res) => {
  try {
    // Find the user in the database based on email and college
    const user = await User.findOne({
      email: req.user.email,
      college: req.user.college,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({
      message: "Welcome to the protected route!",
      email: user.email,
      college: user.college,
    });
  } catch (error) {
    console.error("Protected route error:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

router.post("/signup", async (req, res) => {
  const { email, password, college } = req.body;

  // Trim input to remove any leading or trailing spaces
  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();
  const trimmedCollege = college.trim();

  // Basic input validation
  if (!trimmedEmail || !trimmedPassword || !trimmedCollege) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return res
      .status(400)
      .json({ message: "Please enter a valid email address." });
  }

  try {
    // Check if the user already exists with the same email and college
    const existingUser = await User.findOne({
      email: trimmedEmail,
      college: trimmedCollege,
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already registered in this college." });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(trimmedPassword, 10); // Salt rounds set to 10

    // Create the new user
    const newUser = new User({
      email: trimmedEmail,
      password: hashedPassword,
      college: trimmedCollege,
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    // Respond with success message
    res.status(201).json({ message: "Signup successful!" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

router.post("/login", async (req, res) => {
  let { email, password } = req.body;

  // Trim any leading/trailing spaces from the email and password
  email = email.trim();
  password = password.trim();


  // Basic validation
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }
    // Compare the entered password with the hashed one stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password); // Remove manual hash
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Generate a JWT token using the user's _id
    const token = jwt.sign(
      { userId: user._id, email: user.email, college: user.college }, // Use user._id
      process.env.JWT_SECRET ,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful!",
      token,
    });
    
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

module.exports = router;
