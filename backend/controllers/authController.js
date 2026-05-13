const User = require('../models/User');

const signup = async (req, res) => {
  try {
    const { email, password, fullName, userType, adminSecret } = req.body;

    if (!email || !password || !fullName || !userType) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate userType
    const normalizedUserType = userType.toLowerCase();
    if (!['client', 'freelancer', 'admin'].includes(normalizedUserType)) {
      return res.status(400).json({ error: 'Invalid user type' });
    }

    // Admin account creation requires a secret key
    if (normalizedUserType === 'admin') {
      if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET_KEY) {
        return res.status(403).json({ error: 'Unauthorized: Invalid admin secret' });
      }
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = new User({
      email: email.toLowerCase().trim(),
      password,
      fullName,
      userType: normalizedUserType,
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
    if (!user || !(await user.comparePassword(password))) {
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