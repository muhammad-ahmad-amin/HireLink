const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, addUserReview } = require('../controllers/userController');

router.get('/:email', getUserProfile);
router.put('/:email', updateUserProfile);
router.post('/:email/reviews', addUserReview);

module.exports = router;