const Challenge = require('../models/challenge');
const CommunityMember = require('../models/communityMember');

class ChallengeService {
  /**
   * Lấy danh sách tất cả challenges của một user
   * @param {number} userId - ID của user
   * @returns {Promise<Array>} Danh sách challenges
   */
  async getAllChallenges(userId) {
    try {
      const challenges = await Challenge.findAll({
        where: { community_member_id: userId },
        include: [
          {
            model: CommunityMember,
            as: 'member',
            attributes: ['id', 'first_name', 'last_name']
          }
        ],
        order: [['created_at', 'DESC']]
      });
      return challenges;
    } catch (error) {
      throw new Error(`Failed to retrieve challenges: ${error.message}`);
    }
  }

  /**
   * Lấy một challenge theo ID
   * @param {number} userId - ID của user
   * @param {number} challengeId - ID của challenge
   * @returns {Promise<Object|null>} Challenge object hoặc null nếu không tìm thấy
   */
  async getChallenge(userId, challengeId) {
    try {
      const challenge = await Challenge.findOne({
        where: {
          id: challengeId,
          community_member_id: userId
        },
        include: [
          {
            model: CommunityMember,
            as: 'member',
            attributes: ['id', 'first_name', 'last_name']
          }
        ]
      });
      return challenge;
    } catch (error) {
      throw new Error(`Failed to retrieve challenge: ${error.message}`);
    }
  }
}

module.exports = new ChallengeService();