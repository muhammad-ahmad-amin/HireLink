const express = require('express');
const router = express.Router();
const { getAllJobs, getJobById, createJob, updateJob, deleteJob, applyJob, getJobsByClient, hireFreelancer, getFreelancerJobs, completeJob } = require('../controllers/jobController');
const { isClientOnly } = require('../middleware/authMiddleware');

router.get('/', getAllJobs);
router.get('/client/:clientEmail', getJobsByClient);
router.get('/freelancer/:freelancerEmail', getFreelancerJobs);
router.get('/:jobId', getJobById);
router.post('/', isClientOnly, createJob);
router.post('/:jobId/apply', applyJob);
router.post('/:jobId/hire', hireFreelancer);
router.post('/:jobId/complete', completeJob);
router.put('/:jobId', updateJob);
router.delete('/:jobId', deleteJob);

module.exports = router;