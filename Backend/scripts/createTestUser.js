const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
require("dotenv").config();

async function createUser() {
  await mongoose.connect(process.env.MONGO_URI);
  const username = "admin";
  const password = "admin@123";
  const email = "admin@example.com";
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword, email });
  await user.save();
  console.log("Test user created:", { username, password });
  mongoose.disconnect();
}

createUser();
