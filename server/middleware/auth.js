require('dotenv').config({ path: '../../.env' });
const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  // Log the request headers to check for the token
  // Extract the token from the Authorization header
  const token = req.header("Authorization")?.split(" ")[1]; // "Bearer token"

  if (!token) {
    console.error("Access denied: No token provided");
    return res
      .status(403)
      .json({ message: "Access denied, no token provided." });
  }

  
  try {
    // Verify the token and decode the user data (including college)
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET 
    );

    // Add decoded token data (including college) to the request object
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Invalid token:", error.message);
    return res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = verifyToken;
