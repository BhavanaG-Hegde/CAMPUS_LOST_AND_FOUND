// server/models/itemModels.js
const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contact: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    image: { type: String }, // Store the image path
    type: { type: String, enum: ["lost", "found"], required: true },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);


const Item = mongoose.models.Item || mongoose.model("Item", itemSchema);

module.exports = Item;
