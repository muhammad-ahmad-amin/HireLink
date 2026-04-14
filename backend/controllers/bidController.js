const Bid = require('../models/Bid');
const Job = require('../models/Job');

const getBidsForJob = async (req, res) => {
  try {
    const bids = await Bid.find({ jobId: req.params.jobId }).sort({ createdAt: -1 });
    res.json(bids);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createBid = async (req, res) => {
  try {
    const { jobId, freelancerEmail, bidAmount, proposalText } = req.body;

    if (!jobId || !freelancerEmail || !bidAmount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const bid = new Bid({
      jobId,
      freelancerEmail,
      bidAmount,
      proposalText: proposalText || ''
    });

    await bid.save();

    // Update bid count on job
    job.bidsCount += 1;
    await job.save();

    res.status(201).json({
      message: 'Bid created successfully',
      bid
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateBid = async (req, res) => {
  try {
    const { status } = req.body;
    const bid = await Bid.findById(req.params.bidId);

    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    if (status && ['pending', 'accepted', 'rejected'].includes(status)) {
      bid.status = status;
      await bid.save();
    }

    res.json({
      message: 'Bid updated successfully',
      bid
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBidsForUser = async (req, res) => {
  try {
    const bids = await Bid.find({ freelancerEmail: req.params.email }).sort({ createdAt: -1 }).populate('jobId');
    res.json(bids);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getBidsForJob,
  getBidsForUser,
  createBid,
  updateBid
};