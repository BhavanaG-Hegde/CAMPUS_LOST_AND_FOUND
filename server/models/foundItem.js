const mongoose = require("mongoose");

// Define the schema for FoundItem
const foundItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contact: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    image: { type: String }, // Store the image path
    status: { type: String, default: "Found" }, // Status can be 'Found'
    college: { type: String, required: true }, // College added to associate with the item
  },
  { timestamps: true }
);


// Create a text index for name and description for searchability
foundItemSchema.index({ name: "text", description: "text" });

// Export the model
module.exports =
  mongoose.models.FoundItem || mongoose.model("FoundItem", foundItemSchema);
