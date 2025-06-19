const MemberChallengesService = require('../services/memberChallengesService');

class MemberChallengesController {
    constructor() {
        this.memberChallengesService = new MemberChallengesService();
    }

    /**
     * Lấy tất cả danh sách MemberChallenge.
     * @param {object} req - Request object.
     * @param {object} res - Response object.
     * @returns {Promise<void>}
     */
    async getAllMemberChallenges(req, res) {
        try {
            const memberChallenges = await this.memberChallengesService.getAllMemberChallenges();
            
            res.status(200).json({
                success: true,
                message: 'Lấy danh sách MemberChallenge thành công',
                data: memberChallenges,
                count: memberChallenges.length
            });
        } catch (error) {
            console.error('Lỗi trong getAllMemberChallenges controller:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server khi lấy danh sách MemberChallenge',
                error: error.message
            });
        }
    }

    /**
     * Lấy một MemberChallenge bằng ID.
     * @param {object} req - Request object.
     * @param {object} res - Response object.
     * @returns {Promise<void>}
     */
    async getMemberChallengeById(req, res) {
        try {
            const { id } = req.params;

            // Validate ID from params
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'ID MemberChallenge là bắt buộc'
                });
            }

            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID MemberChallenge phải là một số'
                });
            }

            const memberChallenge = await this.memberChallengesService.getMemberChallengeById(id);
            
            res.status(200).json({
                success: true,
                message: 'Lấy MemberChallenge thành công',
                data: memberChallenge
            });
        } catch (error) {
            console.error('Lỗi trong getMemberChallengeById controller:', error);
            
            // Handle specific error cases
            if (error.message.includes('Không tìm thấy MemberChallenge')) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy MemberChallenge với ID đã cho',
                    error: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: 'Lỗi server khi lấy MemberChallenge',
                error: error.message
            });
        }
    }    /**
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

            const result = await this.memberChallengesService.createMemberChallenge(memberChallengeData);
            
            res.status(201).json(result);
        } catch (error) {
            console.error('Lỗi trong createMemberChallenge controller:', error);
            
            res.status(500).json({
                success: false,
                message: 'Lỗi server khi tạo MemberChallenge',
                error: error.message
            });
        }
    }
}

module.exports = MemberChallengesController;
