const mongoose = require('mongoose');
const User = require("../../../models/users/auth/usersModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// JWT Token Generator
const generateToken = (userId, userEmail) => {
  return jwt.sign(
    { id: userId, email: userEmail },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }  // Extend to 7 days
  );
};

// ✅ Signup
const signup = async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Input validation
  if (!name || !email || !password || !phone) {
    return res.status(400).json({ success: false, message: "Please provide all required fields" });
  }

  const trimmedEmail = email.trim().toLowerCase();
  const trimmedName = name.trim();
  const trimmedPhone = phone.trim();

  try {
    const existingUser = await User.findOne({ email: trimmedEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: trimmedName,
      email: trimmedEmail,
      password: hashedPassword,
      phone: trimmedPhone
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
      token: generateToken(newUser._id, newUser.email),
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Login
const login = async (req, res) => {
  console.log("req body",req.body)
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Please provide both email and password" });
  }

  const trimmedEmail = email.trim().toLowerCase();

  try {
    const user = await User.findOne({ email: trimmedEmail });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }
    // 🔍 Debug logs
    console.log("Input password:", password);
    console.log("Stored hash:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);

    // 🔍 More debug
    console.log("Password match result:", isMatch);

    // const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
      token: generateToken(user._id, user.email),
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};




// Get User by ID
const getUserById = async (req, res) => {
  const { id: userId } = req.params;  // Correct param name based on route
  console.log(`Received userId: ${userId}`);  // Log the received userId

  if (!userId) {
    return res.status(400).json({ success: false, message: 'User ID is missing' });
  }

  // Check if the provided userId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    console.log(`Invalid user ID: ${userId}`);  // Log invalid userId
    return res.status(400).json({ success: false, message: 'Invalid user ID' });
  }

  try {
    console.log(`Searching for user with ID: ${userId}`);
    const user = await User.findById(userId).exec();

    if (!user) {
      console.log(`User with ID: ${userId} not found`);
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    console.log(`User found: ${JSON.stringify(user)}`);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Error occurred while fetching user:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve user' });
  }
};




// Get All Users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude passwords from response
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
};

// Update User
const updateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const updateData = { name, email };

    // Hash new password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User updated successfully", data: user });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ success: false, message: "Update failed" });
  }
};

module.exports = { signup, login, getUsers, deleteUser, getUserById, updateUser };
