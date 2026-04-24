const mongoose = require('mongoose');

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
  userType: { type: String, required: true, enum: ['client', 'freelancer'] },
  profile: { type: profileSchema, default: () => ({}) },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
