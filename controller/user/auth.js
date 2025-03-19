// const jwt = require("jsonwebtoken");
// const User = require("../models/user-model");
// const authenticateToken = async (req, res, next) => {
//   const token = req.headers.authorization && req.headers.authorization.split(" ")[1]; // Get token from Authorization header
  
//   if (!token) {
//     return res.status(401).json({ message: "Authorization token is missing" });
//   }
  
//   // Verify the token
//   jwt.verify(token, process.env.JWT_SECRET_KEY , (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: "Invalid or expired token" });
//     }
//     const userFind = await User.findById({_id:decoded.userId})
//     console.log(decoded.userId)
//     req.userId = decoded.userId; // Attach user info to the request
//     next(); // Proceed to the next middleware/route
//   });
// };

// module.exports = authenticateToken;
const jwt = require("jsonwebtoken");
const User = require("../../models/user-model");

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1]; // Get token from Authorization header
    
    if (!token) {
      return res.status(401).json({ message: "Authorization token is missing" });
    }
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    const userFind = await User.findById(decoded.userId);
    if (!userFind) {
      return res.status(401).json({ message: "User not found" });
    }
    
    req.user = userFind; // Attach full user details to the request
    next(); // Proceed to the next middleware/route
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticateToken;