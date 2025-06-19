const MemberChallengeRepository = require('../repositories/MemberChallengeRepository');

class MemberChallengesService {
    constructor() {
        this.memberChallengeRepository = new MemberChallengeRepository();
    }

    /**
     * Lấy tất cả danh sách MemberChallenge.
     * @returns {Promise<Array<object>>} - Danh sách tất cả MemberChallenge.
     * @throws {Error} - Ném lỗi nếu có vấn đề khi lấy danh sách MemberChallenge.
     */
    async getAllMemberChallenges() {
        try {
            return await this.memberChallengeRepository.getAllMemberChallenges();
        } catch (error) {
            throw new Error(`Lỗi trong service khi lấy danh sách MemberChallenge: ${error.message}`);
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
            // Validate input
            if (!id) {
                throw new Error('ID MemberChallenge không được để trống');
            }

            // Validate ID format (should be a number)
            if (isNaN(id)) {
                throw new Error('ID MemberChallenge phải là một số');
            }

            return await this.memberChallengeRepository.getMemberChallengeById(id);
        } catch (error) {
            throw new Error(`Lỗi trong service khi lấy MemberChallenge theo ID: ${error.message}`);
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
     */
    async createMemberChallenge(memberChallengeData) {
        try {
            // Validate dữ liệu đầu vào
            this.validateMemberChallengeData(memberChallengeData);

            // Chuẩn bị dữ liệu với giá trị mặc định
            const processedData = {
                community_member_id: parseInt(memberChallengeData.community_member_id),
                post_challenge_id: parseInt(memberChallengeData.post_challenge_id),
                joined: memberChallengeData.joined || false,
                commented: memberChallengeData.commented || false
            };

            // Tạo member challenge mới
            const newMemberChallenge = await this.memberChallengeRepository
                .createMemberChallenge(processedData);

            return {
                success: true,
                message: 'Tạo member challenge thành công',
                data: newMemberChallenge
            };
        } catch (error) {
            throw new Error(`Lỗi trong service khi tạo MemberChallenge: ${error.message}`);
        }
    }

    /**
     * Cập nhật một MemberChallenge.
     * @param {number|string} id - ID của MemberChallenge cần cập nhật.
     * @param {object} updateData - Dữ liệu cập nhật.
     * @returns {Promise<object>} - Đối tượng MemberChallenge đã cập nhật.
     * @throws {Error} - Ném lỗi nếu có vấn đề khi cập nhật MemberChallenge.
     */
    async updateMemberChallenge(id, updateData) {
        try {
            // Validate ID
            if (!id || isNaN(id)) {
                throw new Error('ID MemberChallenge không hợp lệ');
            }

            // Check if MemberChallenge exists
            await this.getMemberChallengeById(id);

            // Validate update data
            this.validateUpdateData(updateData);

            return await this.memberChallengeRepository.updateMemberChallenge(id, updateData);
        } catch (error) {
            throw new Error(`Lỗi trong service khi cập nhật MemberChallenge: ${error.message}`);
        }
    }

    /**
     * Xóa một MemberChallenge.
     * @param {number|string} id - ID của MemberChallenge cần xóa.
     * @returns {Promise<boolean>} - True nếu xóa thành công.
     * @throws {Error} - Ném lỗi nếu có vấn đề khi xóa MemberChallenge.
     */
    async deleteMemberChallenge(id) {
        try {
            // Validate ID
            if (!id || isNaN(id)) {
                throw new Error('ID MemberChallenge không hợp lệ');
            }

            // Check if MemberChallenge exists
            await this.getMemberChallengeById(id);

            return await this.memberChallengeRepository.deleteMemberChallenge(id);
        } catch (error) {
            throw new Error(`Lỗi trong service khi xóa MemberChallenge: ${error.message}`);
        }
    }

    /**
     * Cập nhật trạng thái joined của MemberChallenge.
     * @param {number|string} id - ID của MemberChallenge.
     * @param {boolean} joined - Trạng thái joined mới.
     * @returns {Promise<object>} - Đối tượng MemberChallenge đã cập nhật.
     * @throws {Error} - Ném lỗi nếu có vấn đề khi cập nhật.
     */
    async updateJoinedStatus(id, joined) {
        try {
            if (typeof joined !== 'boolean') {
                throw new Error('Trạng thái joined phải là boolean');
            }

            return await this.updateMemberChallenge(id, { joined });
        } catch (error) {
            throw new Error(`Lỗi trong service khi cập nhật trạng thái joined: ${error.message}`);
        }
    }

    /**
     * Cập nhật trạng thái commented của MemberChallenge.
     * @param {number|string} id - ID của MemberChallenge.
     * @param {boolean} commented - Trạng thái commented mới.
     * @returns {Promise<object>} - Đối tượng MemberChallenge đã cập nhật.
     * @throws {Error} - Ném lỗi nếu có vấn đề khi cập nhật.
     */
    async updateCommentedStatus(id, commented) {
        try {
            if (typeof commented !== 'boolean') {
                throw new Error('Trạng thái commented phải là boolean');
            }

            return await this.updateMemberChallenge(id, { commented });
        } catch (error) {
            throw new Error(`Lỗi trong service khi cập nhật trạng thái commented: ${error.message}`);
        }
    }

    /**
     * Lấy danh sách MemberChallenge theo community_member_id.
     * @param {number|string} communityMemberId - ID của community member.
     * @returns {Promise<Array<object>>} - Danh sách MemberChallenge.
     * @throws {Error} - Ném lỗi nếu có vấn đề khi lấy danh sách.
     */
    async getMemberChallengesByCommunityMemberId(communityMemberId) {
        try {
            if (!communityMemberId || isNaN(communityMemberId)) {
                throw new Error('Community Member ID không hợp lệ');
            }

            return await this.memberChallengeRepository.getMemberChallengesByCommunityMemberId(communityMemberId);
        } catch (error) {
            throw new Error(`Lỗi trong service khi lấy MemberChallenge theo Community Member ID: ${error.message}`);
        }
    }

    /**
     * Lấy danh sách MemberChallenge theo post_challenge_id.
     * @param {number|string} postChallengeId - ID của post challenge.
     * @returns {Promise<Array<object>>} - Danh sách MemberChallenge.
     * @throws {Error} - Ném lỗi nếu có vấn đề khi lấy danh sách.
     */
    async getMemberChallengesByPostChallengeId(postChallengeId) {
        try {
            if (!postChallengeId || isNaN(postChallengeId)) {
                throw new Error('Post Challenge ID không hợp lệ');
            }

            return await this.memberChallengeRepository.getMemberChallengesByPostChallengeId(postChallengeId);
        } catch (error) {
            throw new Error(`Lỗi trong service khi lấy MemberChallenge theo Post Challenge ID: ${error.message}`);
        }
    }    /**
     * Validate dữ liệu MemberChallenge.
     * @param {object} data - Dữ liệu cần validate.
     * @throws {Error} - Ném lỗi nếu dữ liệu không hợp lệ.
     */
    validateMemberChallengeData(data) {
        if (!data) {
            throw new Error('Dữ liệu MemberChallenge không được để trống');
        }

        if (!data.community_member_id) {
            throw new Error('Community Member ID là bắt buộc');
        }

        if (isNaN(data.community_member_id) || parseInt(data.community_member_id) <= 0) {
            throw new Error('Community Member ID phải là một số dương');
        }

        if (!data.post_challenge_id) {
            throw new Error('Post Challenge ID là bắt buộc');
        }

        if (isNaN(data.post_challenge_id) || parseInt(data.post_challenge_id) <= 0) {
            throw new Error('Post Challenge ID phải là một số dương');
        }

        if (data.joined !== undefined && typeof data.joined !== 'boolean') {
            throw new Error('Trạng thái joined phải là boolean');
        }

        if (data.commented !== undefined && typeof data.commented !== 'boolean') {
            throw new Error('Trạng thái commented phải là boolean');
        }
    }

    /**
     * Validate dữ liệu cập nhật.
     * @param {object} updateData - Dữ liệu cần validate.
     * @throws {Error} - Ném lỗi nếu dữ liệu không hợp lệ.
     */
    validateUpdateData(updateData) {
        if (!updateData || Object.keys(updateData).length === 0) {
            throw new Error('Dữ liệu cập nhật không được để trống');
        }

        const allowedFields = ['community_member_id', 'post_challenge_id', 'joined', 'commented'];
        const updateFields = Object.keys(updateData);

        // Check if all fields are allowed
        const invalidFields = updateFields.filter(field => !allowedFields.includes(field));
        if (invalidFields.length > 0) {
            throw new Error(`Các trường không được phép cập nhật: ${invalidFields.join(', ')}`);
        }

        // Validate specific fields
        if (updateData.community_member_id !== undefined && isNaN(updateData.community_member_id)) {
            throw new Error('Community Member ID phải là một số');
        }

        if (updateData.post_challenge_id !== undefined && isNaN(updateData.post_challenge_id)) {
            throw new Error('Post Challenge ID phải là một số');
        }

        if (updateData.joined !== undefined && typeof updateData.joined !== 'boolean') {
            throw new Error('Trạng thái joined phải là boolean');
        }

        if (updateData.commented !== undefined && typeof updateData.commented !== 'boolean') {
            throw new Error('Trạng thái commented phải là boolean');
        }
    }
}

module.exports = MemberChallengesService;
