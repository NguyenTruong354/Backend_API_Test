const express = require('express');
const router = express.Router();
const MemberChallengesController = require('../controller/memberChallengesController');

// Khởi tạo controller
const memberChallengesController = new MemberChallengesController();

// Middleware: Lấy userId từ query string và gán vào req.user cho controller dùng
router.use((req, res, next) => {
  if (!req.user) req.user = {};
  if (req.query.userId) req.user.id = req.query.userId;
  next();
});

/**
 * @route   GET /api/member-challenges
 * @desc    Get all member challenges
 * @access  Public
 */
router.get('/', (req, res) => {
  memberChallengesController.getAllMemberChallenges(req, res);
});

/**
 * @route   GET /api/member-challenges/:id
 * @desc    Get a member challenge by ID
 * @access  Public
 * @param   {number} id - Member challenge ID
 */
router.get('/:id', (req, res) => {
  memberChallengesController.getMemberChallengeById(req, res);
});

module.exports = router;
