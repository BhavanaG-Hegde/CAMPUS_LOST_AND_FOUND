const mongoose = require("mongoose");

// Define the schema for LostItem
const lostItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contact: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    image: { type: String }, // Store the image path
    status: { type: String, default: "Lost" }, // Status can be 'Lost'
    college: { type: String, required: true }, // College added to associate with the item
  },
  { timestamps: true }
);


// Create a text index for name and description for searchability
lostItemSchema.index({ name: "text", description: "text" });

// Export the model
module.exports =
  mongoose.models.LostItem || mongoose.model("LostItem", lostItemSchema);
