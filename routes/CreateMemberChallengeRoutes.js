const express = require('express');
const CreateMemberChallengeController = require('../controller/CreateMemberChallengeController');

const router = express.Router();
const createMemberChallengeController = new CreateMemberChallengeController();

/**
 * @route POST /api/member-challenges
 * @desc Tạo một member challenge mới
 * @access Private
 */
router.post('/', createMemberChallengeController.createMemberChallenge.bind(createMemberChallengeController));

module.exports = router;
