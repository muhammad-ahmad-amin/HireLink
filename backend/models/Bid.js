const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  freelancerEmail: { type: String, required: true },
  bidAmount: { type: Number, required: true },
  proposalText: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bid', bidSchema);
