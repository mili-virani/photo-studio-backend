const express = require('express');
const { createFeedback, getAllFeedbacks, getFeedbackById, getFeedbackStats } = require('../../controller/user/feedback-controller');

const router = express.Router();

// Define specific routes first
router.get('/feedback-stats', getFeedbackStats);
router.post('/', createFeedback);
router.get('/', getAllFeedbacks);

// Define dynamic ID route last
router.get('/:id', getFeedbackById);

module.exports = router;