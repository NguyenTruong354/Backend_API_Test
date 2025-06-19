const { Op } = require('sequelize');
const MemberChallenge = require('../models/memberChallenges');

class CreateMemberChallengeRepository {
    constructor() {
        this.model = MemberChallenge;
    }

    /**
     * Tạo một MemberChallenge mới.
     * @param {object} memberChallengeData - Dữ liệu của MemberChallenge cần tạo.
     * @param {number} memberChallengeData.community_member_id - ID của community member.
     * @param {number} memberChallengeData.post_challenge_id - ID của post challenge.
     * @param {boolean} [memberChallengeData.joined=false] - Trạng thái tham gia.
     * @param {boolean} [memberChallengeData.commented=false] - Trạng thái bình luận.
     * @returns {Promise<object>} - Đối tượng MemberChallenge vừa được tạo.
     * @throws {Error} - Ném lỗi nếu có vấn đề khi tạo MemberChallenge.
     */
    async createMemberChallenge(memberChallengeData) {
        try {
            // Kiểm tra dữ liệu đầu vào
            if (!memberChallengeData.community_member_id) {
                throw new Error('community_member_id không được để trống');
            }
            
            if (!memberChallengeData.post_challenge_id) {
                throw new Error('post_challenge_id không được để trống');
            }

            // Kiểm tra xem member challenge đã tồn tại chưa
            const existingMemberChallenge = await this.model.findOne({
                where: {
                    community_member_id: memberChallengeData.community_member_id,
                    post_challenge_id: memberChallengeData.post_challenge_id
                }
            });

            if (existingMemberChallenge) {
                throw new Error('Member challenge đã tồn tại cho member và challenge này');
            }

            // Tạo member challenge mới
            const newMemberChallenge = await this.model.create({
                community_member_id: memberChallengeData.community_member_id,
                post_challenge_id: memberChallengeData.post_challenge_id,
                joined: memberChallengeData.joined || false,
                commented: memberChallengeData.commented || false,
                created_at: new Date()
            });

            return newMemberChallenge.toJSON();
        } catch (error) {
            throw new Error(`Lỗi khi tạo MemberChallenge: ${error.message}`);
        }
    }

    /**
     * Tạo nhiều MemberChallenge cùng lúc.
     * @param {Array<object>} memberChallengesData - Mảng dữ liệu các MemberChallenge cần tạo.
     * @returns {Promise<Array<object>>} - Mảng các đối tượng MemberChallenge vừa được tạo.
     * @throws {Error} - Ném lỗi nếu có vấn đề khi tạo MemberChallenge.
     */
    async createMultipleMemberChallenges(memberChallengesData) {
        try {
            if (!Array.isArray(memberChallengesData) || memberChallengesData.length === 0) {
                throw new Error('Dữ liệu phải là một mảng không rỗng');
            }

            // Kiểm tra dữ liệu đầu vào cho từng item
            for (let i = 0; i < memberChallengesData.length; i++) {
                const item = memberChallengesData[i];
                if (!item.community_member_id) {
                    throw new Error(`Item thứ ${i + 1}: community_member_id không được để trống`);
                }
                if (!item.post_challenge_id) {
                    throw new Error(`Item thứ ${i + 1}: post_challenge_id không được để trống`);
                }
            }

            // Chuẩn bị dữ liệu để tạo
            const dataToCreate = memberChallengesData.map(item => ({
                community_member_id: item.community_member_id,
                post_challenge_id: item.post_challenge_id,
                joined: item.joined || false,
                commented: item.commented || false,
                created_at: new Date()
            }));

            // Tạo nhiều member challenges
            const newMemberChallenges = await this.model.bulkCreate(dataToCreate, {
                ignoreDuplicates: true, // Bỏ qua các bản ghi trùng lặp
                returning: true
            });

            return newMemberChallenges.map(memberChallenge => memberChallenge.toJSON());
        } catch (error) {
            throw new Error(`Lỗi khi tạo nhiều MemberChallenge: ${error.message}`);
        }
    }
}

module.exports = CreateMemberChallengeRepository;
