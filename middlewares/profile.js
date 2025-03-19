const User = require("../models/user-model"); // Import User model

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateProfile = async (req, res) => {
    try {
      const { username, email, phone } = req.body;
      const user = await User.findById(req.user.id);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      user.username = username || user.username;
      user.email = email || user.email;
      user.phone = phone || user.phone;
  
      await user.save();
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  };