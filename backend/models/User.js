const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const reviewSchema = new mongoose.Schema({
  jobId: { type: String, required: true },
  reviewerName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const profileSchema = new mongoose.Schema({
  bio: { type: String, default: '' },
  skills: { type: [String], default: [] },
  hourlyRate: { type: Number, default: 0 },
  portfolio: { type: [String], default: [] },
  reviews: { type: [reviewSchema], default: [] },
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 }
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  userType: { type: String, required: true, enum: ['client', 'freelancer', 'admin'], index: true, lowercase: true },
  profile: { type: profileSchema, default: () => ({}) },
  createdAt: { type: Date, default: Date.now, index: true }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.pre('save', function (next) {
  if (this.isModified('profile.reviews')) {
    this.profile.reviewCount = this.profile.reviews.length;
    if (this.profile.reviewCount > 0) {
      const sum = this.profile.reviews.reduce((total, review) => total + review.rating, 0);
      this.profile.averageRating = Number((sum / this.profile.reviewCount).toFixed(1));
    } else {
      this.profile.averageRating = 0;
    }
  }
  next();
});

const { usersDB } = require('../config/database');

module.exports = usersDB.model('User', userSchema);
