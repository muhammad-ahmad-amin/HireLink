const User = require('../models/User');

const getUserProfile = async (req, res) => {
  try {
    const email = req.params.email.toLowerCase().trim();
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      userType: user.userType,
      profile: user.profile
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const email = req.params.email.toLowerCase().trim();
    const { bio, skills, hourlyRate, portfolio } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (bio !== undefined) user.profile.bio = bio;
    if (skills !== undefined) user.profile.skills = skills;
    if (hourlyRate !== undefined) user.profile.hourlyRate = hourlyRate;
    if (portfolio !== undefined) user.profile.portfolio = portfolio;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      profile: user.profile
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile
};