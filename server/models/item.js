const mongoose = require("mongoose");

// Define the Item schema
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  contact: { type: String, required: true },
  status: { type: String, required: true }, // Can be "lost" or "found"
  image: { type: String, default: "default-image.jpg" }, // Optional image URL
});


// Create the Item model based on the schema
const Item = mongoose.model("Item", itemSchema);

// Export the model so it can be used in other files
module.exports = Item;
