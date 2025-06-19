const CreateMemberChallengeService = require('../services/CreateMemberChallengeService');

class CreateMemberChallengeController {
    constructor() {
        this.createMemberChallengeService = new CreateMemberChallengeService();
    }

    /**
     * Tạo một MemberChallenge mới.
     * @param {object} req - Request object.
     * @param {object} res - Response object.
     * @returns {Promise<void>}
     */
    async createMemberChallenge(req, res) {
        try {
            const memberChallengeData = req.body;

            // Validate dữ liệu đầu vào từ request
            if (!memberChallengeData) {
                return res.status(400).json({
                    success: false,
                    message: 'Dữ liệu không được để trống'
                });
            }

            const { community_member_id, post_challenge_id } = memberChallengeData;

            // Validate các trường bắt buộc
            if (!community_member_id || !post_challenge_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Community Member ID và Post Challenge ID là bắt buộc'
                });
            }

            const result = await this.createMemberChallengeService.createMemberChallenge(memberChallengeData);
            
            res.status(201).json(result);
        } catch (error) {
            console.error('Lỗi trong createMemberChallenge controller:', error);
            
            // Xử lý các trường hợp lỗi cụ thể
            if (error.message.includes('Member đã tham gia challenge này')) {
                return res.status(409).json({
                    success: false,
                    message: 'Member đã tham gia challenge này rồi',
                    error: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: 'Lỗi server khi tạo MemberChallenge',
                error: error.message
            });
        }
    }

    /**
     * Tạo nhiều MemberChallenge cùng lúc.
     * @param {object} req - Request object.
     * @param {object} res - Response object.
     * @returns {Promise<void>}
     */
    async createMultipleMemberChallenges(req, res) {
        try {
            const { memberChallenges } = req.body;

            // Validate dữ liệu đầu vào
            if (!Array.isArray(memberChallenges) || memberChallenges.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Dữ liệu phải là một mảng không rỗng của các member challenges'
                });
            }

            const result = await this.createMemberChallengeService
                .createMultipleMemberChallenges(memberChallenges);
            
            res.status(201).json(result);
        } catch (error) {
            console.error('Lỗi trong createMultipleMemberChallenges controller:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server khi tạo nhiều MemberChallenge',
                error: error.message
            });
        }
    }

    /**
     * Tạo member challenge với logic thông minh.
     * @param {object} req - Request object.
     * @param {object} res - Response object.
     * @returns {Promise<void>}
     */
    async smartCreateMemberChallenge(req, res) {
        try {
            const { 
                community_member_id, 
                post_challenge_id, 
                auto_join = false, 
                auto_comment = false 
            } = req.body;

            // Validate dữ liệu đầu vào
            if (!community_member_id || !post_challenge_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Community Member ID và Post Challenge ID là bắt buộc'
                });
            }

            const result = await this.createMemberChallengeService.smartCreateMemberChallenge({
                community_member_id,
                post_challenge_id,
                auto_join,
                auto_comment
            });
            
            res.status(201).json(result);
        } catch (error) {
            console.error('Lỗi trong smartCreateMemberChallenge controller:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server khi tạo MemberChallenge thông minh',
                error: error.message
            });
        }
    }
}

module.exports = CreateMemberChallengeController;
