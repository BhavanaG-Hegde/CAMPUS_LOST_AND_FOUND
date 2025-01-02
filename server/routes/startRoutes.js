const express = require("express");
const path = require("path");
const router = express.Router();

const LostItem = require("../models/lostItem"); // Your model for lost items

// Serve static files for other routes
// Serve login page when accessing the root URL
router.get("/", (req, res) => {
  console.log("Redirecting to login.html...");
  console.log(
    "Serving login.html from:",
    path.join(__dirname, "..", "..", "public", "login.html")
  );

  res.sendFile(path.join(__dirname, "..", "..", "public", "login.html"));
});

router.get("/index", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

router.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "about.html"));
});

router.get("/privacy-policy", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "privacy_policy.html"));
});

router.get("/report-lost", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "report-lost.html"));
});

router.get("/report-found", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "report-found.html"));
});

router.get("/search", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "public", "search.html"));
});

// Optional: serve CSS, JavaScript, and images as static assets
router.get("/style.css", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "style.css"));
});

// GET: Fetch all lost items
router.get("/lost-items", async (req, res) => {
  try {
    const lostItems = await LostItem.find();
    res.status(200).json(lostItems); // Send lost items data as a JSON response
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Fetch all found items (assuming you have a model for found items as well)
router.get("/found-items", async (req, res) => {
  try {
    const foundItems = await FoundItem.find(); // You should define FoundItem model
    res.status(200).json(foundItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
