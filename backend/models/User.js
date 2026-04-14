const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  bio: { type: String, default: '' },
  skills: { type: [String], default: [] },
  hourlyRate: { type: Number, default: 0 },
  portfolio: { type: [String], default: [] }
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
