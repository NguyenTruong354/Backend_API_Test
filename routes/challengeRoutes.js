const express = require('express');
const router = express.Router();
const challengeController = require('../controller/challengeController');

// Middleware: Lấy userId từ query string và gán vào req.user cho controller dùng
router.use((req, res, next) => {
  if (!req.user) req.user = {};
  if (req.query.userId) req.user.id = req.query.userId;
  next();
});

/**
 * @route   GET /api/challenges
 * @desc    Get all post challenges
 * @access  Public
 */
router.get('/', challengeController.getAllChallenges);

/**
 * @route   GET /api/challenges/:id
 * @desc    Get a post challenge by ID
 * @access  Public
 */
router.get('/:id', challengeController.getChallengeById);

module.exports = router;