const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
exports.registerUser = async (req, res) => {
  console.log('📌 [registerUser] Request received:', req.body);

  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      console.log('⚠️ [registerUser] Missing required fields');
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('⚠️ [registerUser] User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    console.log('🔑 [registerUser] Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log('📦 [registerUser] Creating new user...');
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword
    });

    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ [registerUser] User registered:', newUser._id);
    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      token
    });

  } catch (err) {
    console.error('❌ [registerUser] Error:', err.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

exports.loginUser = async (req, res) => {
  console.log('📌 [loginUser] Request received:', req.body);

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('⚠️ [loginUser] Missing required fields');
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('⚠️ [loginUser] User not found for email:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('⚠️ [loginUser] Password mismatch for user:', user._id);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    console.log('✅ [loginUser] Login successful for user:', user._id);
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token
    });

  } catch (err) {
    console.error('❌ [loginUser] Error:', err.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};
