require('dotenv').config({ path: '../.env' });
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv"); // For environment variables
const jwt = require("jsonwebtoken");

// Import routes
const itemRoutes = require("./routes/itemRoutes");
const startRoutes = require("./routes/startRoutes");
const authRoutes = require("../auth/authRoutes"); // Auth routes for signup/login

const verifyToken = require("./middleware/auth");

// Initialize express app
const app = express();

const corsOptions = {
  allowedHeaders: ["Content-Type", "Authorization"], // Allow the Authorization header
  origin: "http://localhost:3000", // Allow your frontend to make requests
};

app.use(cors(corsOptions));
app.use(express.json());

// Load environment variables
dotenv.config();

// Define uploads directory
const uploadsDir = path.join(__dirname, "uploads");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Check if the uploads directory exists, if not, create it
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS) from 'public'
app.use("/uploads", express.static(uploadsDir)); // Serve images from 'uploads'

// Routes
app.use("/api", itemRoutes); // Endpoints for lost & found items
app.use("/", startRoutes); // Basic routes
app.use(express.json());
app.use("/api/auth", authRoutes); // Auth routes (signup, login)

// Serve static HTML files
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/", (req, res) => {
  console.log(
    "Serving login.html from:",
    path.join(__dirname, "..", "public", "login.html")
  );
  res.sendFile(path.join(__dirname, "..", "public", "login.html"));
});

app.get("/index", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.get("/search", (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "..", "public", "search.html"));
  } catch (error) {
    console.error("Error serving search.html:", error.message);
    res.status(500).send("Internal Server Error");
  }
});
// MongoDB connection
const PORT = process.env.PORT || 3000;
const MONGO_URI =
  process.env.MONGO_URI ;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB!");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

app.use("/api/protected", verifyToken, (req, res) => {
  res.send("Protected route accessed!");
});

// Example of a protected route using the verifyToken middleware
app.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

// Test route to generate and log a JWT token
app.get("/generate-token", (req, res) => {
  const token = jwt.sign(
    { userId: "123", email: "john.doe@example.com" },
    process.env.JWT_SECRET, 
    { expiresIn: "1h" }
  );
  res.json({ token }); // This will return the token as a response
});

app.get("/api/user", verifyToken, (req, res) => {
  // Mock database lookup
  const userData = {
    userId: req.user.userId,
    email: req.user.email,
    college: req.user.college,
  };

  res.json(userData);
});
