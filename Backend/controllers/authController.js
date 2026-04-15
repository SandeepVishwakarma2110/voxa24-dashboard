const User = require("../models/User");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }
    // Generate JWT
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ success: true, token, user: { username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Optional: Signup endpoint
exports.signup = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Username already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, email });
    await user.save();
    // Generate JWT
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.status(201).json({ success: true, token, user: { username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};