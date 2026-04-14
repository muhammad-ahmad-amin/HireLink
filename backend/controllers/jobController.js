const Job = require('../models/Job');

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createJob = async (req, res) => {
  try {
    const { title, description, budget, category, clientEmail } = req.body;

    if (!title || !description || !budget || !clientEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const job = new Job({
      title,
      description,
      budget,
      category,
      clientEmail,
      status: 'open'
    });

    await job.save();

    res.status(201).json({
      message: 'Job created successfully',
      job
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateJob = async (req, res) => {
  try {
    const { title, description, budget, status } = req.body;
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (title !== undefined) job.title = title;
    if (description !== undefined) job.description = description;
    if (budget !== undefined) job.budget = budget;
    if (status !== undefined) job.status = status;
    job.updatedAt = new Date();

    await job.save();

    res.json({
      message: 'Job updated successfully',
      job
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.jobId);
    if (!deletedJob) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const applyJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { freelancerEmail, freelancerName } = req.body;

    if (!freelancerEmail || !freelancerName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if freelancer already applied
    const alreadyApplied = job.applications.some(app => app.freelancerEmail === freelancerEmail);
    if (alreadyApplied) {
      return res.status(400).json({ error: 'You have already applied for this job' });
    }

    // Add application
    job.applications.push({
      freelancerEmail,
      freelancerName,
      appliedAt: new Date()
    });

    await job.save();

    res.json({
      message: 'Application submitted successfully',
      job
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getJobsByClient = async (req, res) => {
  try {
    const { clientEmail } = req.params;

    if (!clientEmail) {
      return res.status(400).json({ error: 'Client email is required' });
    }

    const jobs = await Job.find({ clientEmail: clientEmail.toLowerCase().trim() }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const hireFreelancer = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { freelancerEmail } = req.body;

    if (!freelancerEmail) {
      return res.status(400).json({ error: 'Freelancer email is required' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if freelancer has applied
    const applicant = job.applications.find(app => app.freelancerEmail === freelancerEmail);
    if (!applicant) {
      return res.status(400).json({ error: 'This freelancer has not applied for this job' });
    }

    // Update job status to in-progress and set hired freelancer
    job.status = 'in-progress';
    job.hiredFreelancer = freelancerEmail;
    await job.save();

    res.json({
      message: 'Freelancer hired successfully',
      job
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFreelancerJobs = async (req, res) => {
  try {
    const { freelancerEmail } = req.params;

    if (!freelancerEmail) {
      return res.status(400).json({ error: 'Freelancer email is required' });
    }

    // Find jobs where freelancer has applied
    const jobs = await Job.find({
      'applications.freelancerEmail': freelancerEmail.toLowerCase().trim()
    }).sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const completeJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { freelancerEmail } = req.body;

    if (!freelancerEmail) {
      return res.status(400).json({ error: 'Freelancer email is required' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if freelancer is hired for this job
    if (job.hiredFreelancer !== freelancerEmail) {
      return res.status(400).json({ error: 'You are not hired for this job' });
    }

    // Mark job as completed
    job.status = 'completed';
    job.completedAt = new Date();
    await job.save();

    res.json({
      message: 'Job marked as completed',
      job
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  applyJob,
  getJobsByClient,
  hireFreelancer,
  getFreelancerJobs,
  completeJob
};