const express = require('express');
const router = express.Router();
const { getPlatformStats } = require('../controllers/statsController');

// GET /api/stats - Advanced aggregation for platform insights
router.get('/', getPlatformStats);

module.exports = router;
