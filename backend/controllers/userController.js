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

const addUserReview = async (req, res) => {
  try {
    const email = req.params.email.toLowerCase().trim();
    const { reviewerName, rating, comment, jobId } = req.body;

    if (!reviewerName || !rating || !jobId) {
      return res.status(400).json({ error: 'Reviewer name, rating, and job ID are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existingReview = user.profile.reviews.find(
      (review) => review.jobId === jobId && review.reviewerName === reviewerName
    );
    if (existingReview) {
      return res.status(400).json({ error: 'Review for this job has already been submitted' });
    }

    user.profile.reviews.unshift({ jobId, reviewerName, rating, comment });
    // Note: reviewCount and averageRating are automatically updated by User model trigger

    await user.save();

    res.status(201).json({
      message: 'Review submitted successfully',
      profile: user.profile
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  addUserReview
};