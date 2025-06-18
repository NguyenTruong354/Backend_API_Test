const { Op } = require('sequelize');
const MemberChallenge = require('../models/memberChallenges');

class MemberChallengeRepository {
    constructor() {
        this.model = MemberChallenge;
    }

    /**
     * Lấy tất cả danh sách MemberChallenge.
     * @returns {Promise<Array<object>>} - Danh sách tất cả MemberChallenge.
     * @throws {Error} - Ném lỗi nếu có vấn đề khi lấy danh sách MemberChallenge.
     */
    async getAllMemberChallenges() {
        try {
            const memberChallenges = await this.model.findAll({
                order: [['created_at', 'DESC']]
            });
            return memberChallenges.map(memberChallenge => memberChallenge.toJSON());
        } catch (error) {
            throw new Error(`Lỗi khi lấy danh sách MemberChallenge: ${error.message}`);
        }
    }

    /**
     * Lấy một MemberChallenge bằng ID.
     * @param {number|string} id - ID của MemberChallenge.
     * @returns {Promise<object>} - Đối tượng MemberChallenge.
     * @throws {Error} - Ném lỗi nếu không tìm thấy MemberChallenge hoặc có lỗi truy vấn.
     */
    async getMemberChallengeById(id) {
        try {
            if (!id) {
                throw new Error('ID MemberChallenge không được để trống');
            }

            const memberChallenge = await this.model.findByPk(id);

            if (!memberChallenge) {
                throw new Error('Không tìm thấy MemberChallenge với ID đã cho.');
            }
            return memberChallenge.toJSON();
        } catch (error) {
            if (error.message === 'Không tìm thấy MemberChallenge với ID đã cho.') {
                throw error;
            }
            throw new Error(`Lỗi khi lấy MemberChallenge theo ID: ${error.message}`);
        }
    }
}

module.exports = MemberChallengeRepository; 