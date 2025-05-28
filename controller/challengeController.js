const PostChallengeService = require('../services/PostChallengeService');
const PostChallengeRepository = require('../repositories/PostChallengeRepository');
const { successResponse, errorResponse } = require('../utils/constants');
const logger = require('../utils/logger');

// Khởi tạo PostChallengeService với PostChallengeRepository
const postChallengeRepository = new PostChallengeRepository();
const postChallengeService = new PostChallengeService(postChallengeRepository);

/**
 * @description Get all post challenges
 * @route GET /api/challenges
 * @access Public
 */
const getAllChallenges = async (req, res) => {
  const userId = req.user?.id || 'unknown';
  
  try {
    const challenges = await postChallengeService.getAllPostChallenges();
    
    logger.info({
      message: 'Successfully retrieved post challenges',
      userId,
      count: challenges.length,
    });

    return res.status(200).json(
      successResponse('Post challenges retrieved successfully', challenges)
    );
  } catch (error) {
    logger.error({
      message: 'Failed to retrieve post challenges',
      userId,
      error: error.message,
      stack: error.stack,
    });

    return res.status(500).json(
      errorResponse('Failed to retrieve post challenges', error.message)
    );
  }
};

/**
 * @description Get a single post challenge by ID
 * @route GET /api/challenges/:id
 * @access Public
 */
const getChallengeById = async (req, res) => {
  const userId = req.user?.id || 'unknown';
  const { id: challengeId } = req.params;

  try {
    const challenge = await postChallengeService.getPostChallengeById(challengeId);

    if (!challenge) {
      logger.warn({
        message: 'Post challenge not found',
        userId,
        challengeId,
      });

      return res.status(404).json(
        errorResponse(`Post challenge with ID ${challengeId} not found`)
      );
    }

    logger.info({
      message: 'Successfully retrieved post challenge',
      userId,
      challengeId,
    });

    return res.status(200).json(
      successResponse('Post challenge retrieved successfully', challenge)
    );
  } catch (error) {
    logger.error({
      message: 'Failed to retrieve post challenge',
      userId,
      challengeId,
      error: error.message,
      stack: error.stack,
    });

    return res.status(500).json(
      errorResponse('Failed to retrieve post challenge', error.message)
    );
  }
};

module.exports = {
  getAllChallenges,
  getChallengeById,
};