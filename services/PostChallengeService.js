const PostChallengeRepository = require('../repositories/PostChallengeRepository');
const { Op } = require('sequelize');

class PostChallengeService {
    constructor() {
        this.postChallengeRepository = new PostChallengeRepository();
    }    /**
     * Lấy tất cả danh sách PostChallenge với bộ lọc tùy chọn.
     * @param {Object} filters - Các điều kiện lọc (type, is_show, post_id, event_id)
     * @returns {Promise<Array<object>>} - Danh sách tất cả PostChallenge.
     * @throws {Error} - Ném lỗi nếu có vấn đề khi lấy danh sách.
     */
    async getAllPostChallenges(filters = {}) {
        try {
            // Lấy tất cả PostChallenge với join
            const allPostChallenges = await this.postChallengeRepository.getAllPostChallenges();
            
            // Áp dụng bộ lọc nếu có
            let filteredPostChallenges = allPostChallenges;
            
            if (filters.type) {
                filteredPostChallenges = filteredPostChallenges.filter(pc => pc.type === filters.type);
            }
            
            if (filters.is_show !== undefined) {
                filteredPostChallenges = filteredPostChallenges.filter(pc => pc.is_show === filters.is_show);
            }
            
            if (filters.post_id) {
                filteredPostChallenges = filteredPostChallenges.filter(pc => pc.post_id === filters.post_id);
            }
            
            if (filters.event_id) {
                filteredPostChallenges = filteredPostChallenges.filter(pc => pc.event_id === filters.event_id);
            }
            
            return filteredPostChallenges;
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