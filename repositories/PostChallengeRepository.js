const { Op } = require('sequelize');
const PostChallenge = require('../models/postChallenge');

class PostChallengeRepository {
    constructor() {
        this.model = PostChallenge;
    }

    /**
     * Lấy tất cả danh sách PostChallenge.
     * @returns {Promise<Array<object>>} - Danh sách tất cả PostChallenge.
     * @throws {Error} - Ném lỗi nếu có vấn đề khi lấy danh sách PostChallenge.
     */
    async getAllPostChallenges() {
        try {
            const postChallenges = await this.model.findAll({
                order: [['created_at', 'DESC']]
            });
            return postChallenges.map(postChallenge => postChallenge.toJSON());
        } catch (error) {
            throw new Error(`Lỗi khi lấy danh sách PostChallenge: ${error.message}`);
        }
    }

    /**
     * Lấy danh sách PostChallenge với các bộ lọc.
     * @param {Object} whereCondition - Các điều kiện lọc
     * @returns {Promise<Array<object>>} - Danh sách PostChallenge đã lọc.
     * @throws {Error} - Ném lỗi nếu có vấn đề khi lấy danh sách PostChallenge.
     */
    async getPostChallengesWithFilters(whereCondition = {}) {
        try {
            const postChallenges = await this.model.findAll({
                where: whereCondition,
                order: [['created_at', 'DESC']]
            });
            return postChallenges.map(postChallenge => postChallenge.toJSON());
        } catch (error) {
            throw new Error(`Lỗi khi lấy danh sách PostChallenge với bộ lọc: ${error.message}`);
        }
    }

    /**
     * Lấy một PostChallenge cụ thể bằng ID.
     * @param {number|string} id - ID của PostChallenge.
     * @returns {Promise<object>} - Đối tượng PostChallenge.
     * @throws {Error} - Ném lỗi nếu không tìm thấy PostChallenge hoặc có lỗi truy vấn.
     */
    async getPostChallengeById(id) {
        try {
            if (!id) {
                throw new Error('ID PostChallenge không được để trống');
            }

            const postChallenge = await this.model.findByPk(id);

            if (!postChallenge) {
                throw new Error('Không tìm thấy PostChallenge với ID đã cho.');
            }
            return postChallenge.toJSON();
        } catch (error) {
            if (error.message === 'Không tìm thấy PostChallenge với ID đã cho.') {
                throw error;
            }
            throw new Error(`Lỗi khi lấy PostChallenge theo ID: ${error.message}`);
        }
    }
}

module.exports = PostChallengeRepository;