const challengeService = require('../services/challengeService');
const { errorResponse, successResponse } = require('../utils/constants');
const logger = require('../utils/logger');

/**
 * Retrieves all challenges for the authenticated user.
 * @param {Object} req - Express request object containing user information.
 * @param {Object} res - Express response object to send the response.
 * @param {Function} next - Express next middleware function for error handling.
 * @returns {Promise<void>} Responds with a JSON object containing the list of challenges or passes errors to the next middleware.
 */
exports.getAllChallenges = async (req, res, next) => {
  try {
    // Extract user ID from authenticated user data
    const userId = req.user.id;
    
    // Fetch all challenges for the user from the challenge service
    const challenges = await challengeService.getAllChallenges(userId);
    
    // Log the number of challenges retrieved
    logger.info(`Retrieved ${challenges.length} challenges for user ${userId}`);
    
    // Send success response with challenges data
    return res.status(200).json(successResponse('Challenges retrieved successfully', challenges));
  } catch (error) {
    // Pass any errors to the error-handling middleware
    next(error);
  }
};

/**
 * Retrieves a single challenge by its ID for the authenticated user.
 * @param {Object} req - Express request object containing user information and challenge ID in params.
 * @param {Object} res - Express response object to send the response.
 * @param {Function} next - Express next middleware function for error handling.
 * @returns {Promise<void>} Responds with a JSON object containing the challenge data or an error if not found.
 */
exports.getChallenge = async (req, res, next) => {
  try {
    // Extract user ID and challenge ID from request
    const userId = req.user.id;
    const challengeId = req.params.id;
    
    // Fetch the challenge by ID for the user
    const challenge = await challengeService.getChallenge(userId, challengeId);
    
    // Check if the challenge exists
    if (!challenge) {
      logger.warn(`Challenge ${challengeId} not found for user ${userId}`);
      return res.status(404).json(errorResponse('Challenge not found'));
    }
    
    // Log successful retrieval of the challenge
    logger.info(`Retrieved challenge ${challengeId} for user ${userId}`);
    
    // Send success response with challenge data
    return res.status(200).json(successResponse('Challenge retrieved successfully', challenge));
  } catch (error) {
    // Pass any errors to the error-handling middleware
    next(error);
  }
};