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
    }    /**
     * Tạo một MemberChallenge mới.
     * @param {object} memberChallengeData - Dữ liệu của MemberChallenge cần tạo.
     * @param {number} memberChallengeData.community_member_id - ID của community member.
     * @param {number} memberChallengeData.post_challenge_id - ID của post challenge.
     * @param {boolean} [memberChallengeData.joined=false] - Trạng thái tham gia.
     * @param {boolean} [memberChallengeData.commented=false] - Trạng thái bình luận.
     * @returns {Promise<object>} - Đối tượng MemberChallenge vừa được tạo.
     * @throws {Error} - Ném lỗi nếu có vấn đề khi tạo MemberChallenge.
     */    async createMemberChallenge(memberChallengeData) {
        try {
            // Kiểm tra dữ liệu đầu vào
            if (!memberChallengeData.community_member_id) {
                throw new Error('community_member_id không được để trống');
            }
              if (!memberChallengeData.post_challenge_id) {
                throw new Error('post_challenge_id không được để trống');
            }

            // Kiểm tra xem member challenge đã tồn tại chưa (do có UNIQUE constraint)
            const existingMemberChallenge = await this.model.findOne({
                where: {
                    community_member_id: memberChallengeData.community_member_id,
                    post_challenge_id: memberChallengeData.post_challenge_id
                }
            });

            if (existingMemberChallenge) {
                throw new Error('Member challenge đã tồn tại cho member và challenge này');
            }

            // Tìm ID lớn nhất hiện tại và tăng lên 1
            const maxIdResult = await this.model.findOne({
                attributes: [[this.model.sequelize.fn('MAX', this.model.sequelize.col('member_challenge_id')), 'maxId']],
                raw: true
            });
            
            const nextId = (maxIdResult.maxId || 0) + 1;            // Tạo member challenge mới với ID thủ công
            const newMemberChallenge = await this.model.create({
                member_challenge_id: nextId,
                community_member_id: memberChallengeData.community_member_id,
                post_challenge_id: memberChallengeData.post_challenge_id,
                joined: memberChallengeData.joined || false,
                commented: memberChallengeData.commented || false,
                created_at: new Date()
            });            return newMemberChallenge.toJSON();
        } catch (error) {
            console.error('Chi tiết lỗi trong createMemberChallenge:', error);
            throw new Error(`Lỗi khi tạo MemberChallenge: ${error.message}`);
        }
    }
}

module.exports = MemberChallengeRepository;