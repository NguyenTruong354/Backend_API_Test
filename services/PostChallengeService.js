const PostChallengeRepository = require('../repositories/PostChallengeRepository');
const { Op } = require('sequelize');

class PostChallengeService {
    constructor() {
        this.postChallengeRepository = new PostChallengeRepository();
    }

    /**
     * Lấy tất cả danh sách PostChallenge với bộ lọc tùy chọn.
     * @param {Object} filters - Các điều kiện lọc (type, is_show, post_id, event_id)
     * @returns {Promise<Array<object>>} - Danh sách tất cả PostChallenge.
     * @throws {Error} - Ném lỗi nếu có vấn đề khi lấy danh sách.
     */
    async getAllPostChallenges(filters = {}) {
        try {
            const whereCondition = {};
            
            // Áp dụng các bộ lọc
            if (filters.type) {
                whereCondition.type = filters.type;
            }
            
            if (filters.is_show !== undefined) {
                whereCondition.is_show = filters.is_show;
            }
            
            if (filters.post_id) {
                whereCondition.post_id = filters.post_id;
            }
            
            if (filters.event_id) {
                whereCondition.event_id = filters.event_id;
            }
            
            // Cần bổ sung phương thức mới vào Repository để hỗ trợ lọc
            const postChallenges = await this.postChallengeRepository.getPostChallengesWithFilters(whereCondition);
            
            return postChallenges;
        } catch (error) {
            throw new Error(`Failed to retrieve post challenges: ${error.message}`);
        }
    }

    /**
     * Lấy một PostChallenge theo ID.
     * @param {number|string} id - ID của PostChallenge.
     * @returns {Promise<Object|null>} - Đối tượng PostChallenge hoặc null nếu không tìm thấy.
     * @throws {Error} - Ném lỗi nếu có vấn đề khi truy vấn.
     */
    async getPostChallengeById(id) {
        try {
            const postChallenge = await this.postChallengeRepository.getPostChallengeById(id);
            return postChallenge;
        } catch (error) {
            throw new Error(`Failed to retrieve post challenge: ${error.message}`);
        }
    }
}

module.exports = new PostChallengeService();