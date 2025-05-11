require("dotenv").config({ path: "../../.env" });
const express = require("express");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const LostItem = require("../models/LostItem");
const FoundItem = require("../models/foundItem");
const User = require("../models/user");

const verifyToken = require("../middleware/auth");

const router = express.Router();

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Invalid file type. Only images are allowed."), false);
};

const upload = multer({
  storage,
  fileFilter,
});

// --- Routes ---

// Report Lost Item
router.post("/lost", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { name, contact, title, description, category, date, location } =
      req.body;
    const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : null;

    // Access the college from the decoded JWT token
    const userCollege = req.user.college; // Extract college from the decoded token

    // Create a new LostItem with the college info
    const newLostItem = new LostItem({
      name,
      contact,
      title,
      description,
      category,
      date,
      location,
      image: imagePath,
      college: userCollege, // Use the user's college from the JWT
    });

    await newLostItem.save();

    res.status(201).json({
      message: "Lost item reported successfully",
      item: newLostItem,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error reporting lost item",
      error: error.message,
    });
  }
});

router.post("/found", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { name, contact, title, description, category, date, location } =
      req.body;
    const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : null;

    // Access the college from the decoded JWT token
    const userCollege = req.user.college; // Extract college from the decoded token

    // Create a new FoundItem with the college info
    const newFoundItem = new FoundItem({
      name,
      contact,
      title,
      description,
      category: category || "other", // Default to 'other' if category is not provided
      date,
      location,
      image: imagePath,
      college: userCollege, // Use the user's college from the JWT
    });

    await newFoundItem.save();

    res.status(201).json({
      message: "Found item reported successfully",
      item: newFoundItem,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error reporting found item",
      error: error.message,
    });
  }
});

// Fetch Lost Items
router.get("/lost", verifyToken, async (req, res) => {
  try {
    const userCollege = req.user?.college; // Access college info from the JWT payload

    if (!userCollege) {
      return res
        .status(400)
        .json({ message: "User college information missing in token." });
    }
    // Fetch items that belong to the same college
    const lostItems = await LostItem.find({ college: userCollege });

    const formattedItems = lostItems.map((item) => ({
      name: item.name || "Unnamed Item",
      contact: item.contact || "N/A",
      title: item.title || "No Title",
      description: item.description || "No Description",
      location: item.location || "Unknown",
      image: item.image
        ? item.image.replace(/\\/g, "/")
        : "/uploads/default-image.jpg",
      status: "Lost",
    }));

    res.json(formattedItems); // Return the items to the client
  } catch (error) {
    console.error("Error fetching lost items:", error.message);
    res
      .status(500)
      .json({ message: "Error fetching lost items", error: error.message });
  }
});

router.get("/found", verifyToken, async (req, res) => {
  try {
    const userCollege = req.user.college; // Access college info from the JWT payload

    // Fetch found items that belong to the same college
    const foundItems = await FoundItem.find({ college: userCollege });

    const formattedItems = foundItems.map((item) => ({
      name: item.name || "Unnamed Item",
      contact: item.contact || "N/A",
      title: item.title || "No Title",
      description: item.description || "No Description",
      location: item.location || "Unknown",
      image: item.image
        ? item.image.replace(/\\/g, "/")
        : "/uploads/default-image.jpg",
      status: "Found",
    }));

    res.json(formattedItems); // Return the formatted items to the client
  } catch (error) {
    res.status(500).json({ message: "Error fetching found items" });
  }
});

// Search Items (POST)
router.post("/search", verifyToken, async (req, res) => {
  const { keyword, category } = req.body;

  try {
    const searchQuery = { college: req.user.college }; // Use req.user.college to get the college from the JWT token
    if (keyword) searchQuery.title = { $regex: keyword, $options: "i" };
    if (category) searchQuery.category = category;

    const lostItems = await LostItem.find(searchQuery).lean();
    const foundItems = await FoundItem.find(searchQuery).lean();

    const allItems = [
      ...lostItems.map((item) => ({ ...item, status: "Lost" })),
      ...foundItems.map((item) => ({ ...item, status: "Found" })),
    ];

    res.status(200).json(allItems); // Return all found and lost items in response
  } catch (error) {
    res.status(500).json({ message: "Error searching items" });
  }
});

// Search Items (GET) [Optional for rendering in browser]
router.get("/search", verifyToken, async (req, res) => {
  const { keyword, category } = req.query;

  try {
    const searchQuery = { college: req.user.college }; // Use req.user.college to get the college from the JWT token
    if (keyword) searchQuery.title = { $regex: keyword, $options: "i" };
    if (category) searchQuery.category = category;

    const lostItems = await LostItem.find(searchQuery).lean();
    const foundItems = await FoundItem.find(searchQuery).lean();

    const allItems = [
      ...lostItems.map((item) => ({ ...item, status: "Lost" })),
      ...foundItems.map((item) => ({ ...item, status: "Found" })),
    ];

    res.status(200).json(allItems); // Return all found and lost items in response
  } catch (error) {
    res.status(500).json({ message: "Error searching items" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user in the database by username
    const user = await User.findOne({ username });

    // Check if the user exists or if the password doesn't match
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create a JWT token with user data, including college
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        college: user.college, // Include the college in the token
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token expiration time (1 hour)
    );

    // Return the token and college info in the response
    res.status(200).json({
      message: "Login successful",
      token,
      college: user.college, // Send the college along with the token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

router.get("/api/user", verifyToken, (req, res) => {
  const userId = req.user.id; // Assuming the JWT contains the user ID

  // Fetch user data from database (pseudo-code)
  const user = database.getUserById(userId); // Replace with actual database query

  if (user) {
    res.json({
      email: user.email,
      college: user.college,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

module.exports = router;
