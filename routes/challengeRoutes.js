const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challengeController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/challenges
 * @desc    Get all challenges for authenticated user
 * @access  Private
 */
router.get('/', challengeController.getAllChallenges);

/**
 * @route   GET /api/challenges/:id
 * @desc    Get a challenge by ID
 * @access  Private
 */
router.get('/:id', challengeController.getChallenge);

module.exports = router;