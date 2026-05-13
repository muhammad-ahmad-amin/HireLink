const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  freelancerEmail: { type: String, required: true },
  bidAmount: { type: Number, required: true },
  proposalText: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now, index: true }
});

// Indexes for faster lookups
bidSchema.index({ jobId: 1 });
bidSchema.index({ freelancerEmail: 1 });

const { bidsDB } = require('../config/database');

module.exports = bidsDB.model('Bid', bidSchema);
