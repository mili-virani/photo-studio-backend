const Feedback = require('../../models/feedback-model'); // Import the Feedback model

// POST: Create a new feedback
const createFeedback = async (req, res) => {
    try {
        const { name, email, message, rating } = req.body;

        // Validate rating range
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        const feedback = new Feedback({ name, email, message, rating });
        await feedback.save();

        res.status(201).json({ message: 'Feedback submitted successfully', feedback });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting feedback', error: error.message });
    }
};

// GET: Fetch all feedback
const getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 }); // Fetch all feedbacks, sorted by latest
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching feedback', error: error.message });
    }
};

// GET: Fetch a single feedback by ID
const getFeedbackById = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        res.status(200).json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching feedback', error: error.message });
    }
};

const getFeedbackStats = async (req, res) => {
    try {
      const totalFeedback = await Feedback.countDocuments();
      const positiveFeedback = await Feedback.countDocuments({ rating: { $gte: 4 } }); // Considering 4+ as positive
  
      res.json({ positiveFeedback, totalFeedback });
    } catch (error) {
      res.status(500).json({ message: "Error fetching feedback stats", error });
    }
  };
module.exports = { createFeedback, getAllFeedbacks, getFeedbackById ,getFeedbackStats};