const express = require('express');
const router = express.Router();
const { getBidsForJob, getBidsForUser, createBid, updateBid } = require('../controllers/bidController');

router.get('/jobs/:jobId/bids', getBidsForJob);
router.get('/user/:email', getBidsForUser);
router.post('/', createBid);
router.put('/:bidId', updateBid);

module.exports = router;