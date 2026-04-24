const User = require('../models/User');

const signup = async (req, res) => {
  try {
    const { email, password, fullName, userType } = req.body;

    if (!email || !password || !fullName || !userType) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = new User({
      email: email.toLowerCase().trim(),
      password,
      fullName,
      userType,
      profile: {
        bio: '',
        skills: [],
        hourlyRate: 0,
        portfolio: [],
        reviews: [],
        averageRating: 0,
        reviewCount: 0
      }
    });

    await user.save();

    res.status(201).json({
      message: 'Signup successful',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        userType: user.userType
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        userType: user.userType
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  signup,
  login
};