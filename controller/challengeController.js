const challengeService = require('../services/challengeService');
const { successResponse, errorResponse } = require('../utils/constants');
const logger = require('../utils/logger');

// Lấy danh sách challenges của user
exports.getAllChallenges = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const challenges = await challengeService.getAllChallenges(userId);

    logger.info(`Retrieved ${challenges.length} challenges for user ${userId}`);
    return res.status(200).json(successResponse('Challenges retrieved successfully', challenges));
  } catch (error) {
    logger.error(`Error retrieving challenges for user ${req.user.id}: ${error.message}`);
    next(error);
  }
};

// Lấy một challenge theo ID
exports.getChallenge = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const challengeId = req.params.id;
    const challenge = await challengeService.getChallenge(userId, challengeId);

    if (!challenge) {
      logger.warn(`Challenge ${challengeId} not found for user ${userId}`);
      return res.status(404).json(errorResponse(`Challenge with ID ${challengeId} not found`));
    }

    logger.info(`Retrieved challenge ${challengeId} for user ${userId}`);
    return res.status(200).json(successResponse('Challenge retrieved successfully', challenge));
  } catch (error) {
    logger.error(`Error retrieving challenge ${req.params.id} for user ${req.user.id}: ${error.message}`);
    next(error);
  }
};
