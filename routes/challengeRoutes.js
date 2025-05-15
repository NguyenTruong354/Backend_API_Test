const express = require('express');
const router = express.Router();
const challengeController = require('../controller/challengeController');
// const { authenticate } = require('../middleware/auth');

// // All routes require authentication
// router.use(authenticate);

// Middleware: Lấy userId từ query string và gán vào req.user cho controller dùng
router.use((req, res, next) => {
  if (!req.user) req.user = {};
  if (req.query.userId) req.user.id = req.query.userId;
  next();
});

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