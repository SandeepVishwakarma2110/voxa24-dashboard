const User = require("../models/User");
const bcrypt = require("bcryptjs");

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
    // For demo: return user info (in real app, use JWT)
    res.json({ success: true, user: { username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};