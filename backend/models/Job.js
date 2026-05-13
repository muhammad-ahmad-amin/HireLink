const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  category: { type: String, default: 'general' },
  clientEmail: { type: String, required: true },
  status: { type: String, enum: ['open', 'in-progress', 'completed'], default: 'open' },
  hiredFreelancer: { type: String, default: null },
  applications: [{
    freelancerEmail: { type: String, required: true },
    freelancerName: { type: String, required: true },
    appliedAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null }
});


jobSchema.index({ category: 1, status: 1 });


jobSchema.index({ title: 'text', description: 'text' });

const { jobsDB } = require('../config/database');

module.exports = jobsDB.model('Job', jobSchema);
