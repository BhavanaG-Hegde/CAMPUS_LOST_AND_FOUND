const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true }, // Changed from username to email
    password: { type: String, required: true },
    college: { type: String, required: true }, // New field for college
  },
  { timestamps: true }
);


// Method to compare passwords
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
