const CreateMemberChallengeRepository = require('../repositories/CreateMemberChallengeRepository');

class CreateMemberChallengeService {
    constructor() {
        this.createMemberChallengeRepository = new CreateMemberChallengeRepository();
    }

    /**
     * Tạo một MemberChallenge mới với validation đầy đủ.
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

            // Kiểm tra xem member challenge đã tồn tại chưa
            const existingMemberChallenge = await this.createMemberChallengeRepository
                .getMemberChallengeByMemberAndChallenge(
                    processedData.community_member_id,
                    processedData.post_challenge_id
                );

            if (existingMemberChallenge) {
                throw new Error('Member đã tham gia challenge này rồi');
            }

            // Tạo member challenge mới
            const newMemberChallenge = await this.createMemberChallengeRepository
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
     * Tạo nhiều MemberChallenge cùng lúc với validation.
     * @param {Array<object>} memberChallengesData - Mảng dữ liệu các MemberChallenge cần tạo.
     * @returns {Promise<object>} - Kết quả tạo nhiều MemberChallenge.
     * @throws {Error} - Ném lỗi nếu có vấn đề khi tạo MemberChallenge.
     */
    async createMultipleMemberChallenges(memberChallengesData) {
        try {
            // Validate dữ liệu đầu vào
            if (!Array.isArray(memberChallengesData) || memberChallengesData.length === 0) {
                throw new Error('Dữ liệu phải là một mảng không rỗng');
            }

            // Validate từng item trong mảng
            const processedData = [];
            for (let i = 0; i < memberChallengesData.length; i++) {
                const item = memberChallengesData[i];
                
                try {
                    this.validateMemberChallengeData(item);
                    processedData.push({
                        community_member_id: parseInt(item.community_member_id),
                        post_challenge_id: parseInt(item.post_challenge_id),
                        joined: item.joined || false,
                        commented: item.commented || false
                    });
                } catch (error) {
                    throw new Error(`Lỗi ở item thứ ${i + 1}: ${error.message}`);
                }
            }

            // Tạo nhiều member challenges
            const newMemberChallenges = await this.createMemberChallengeRepository
                .createMultipleMemberChallenges(processedData);

            return {
                success: true,
                message: `Tạo thành công ${newMemberChallenges.length} member challenges`,
                data: newMemberChallenges,
                total: newMemberChallenges.length
            };
        } catch (error) {
            throw new Error(`Lỗi trong service khi tạo nhiều MemberChallenge: ${error.message}`);
        }
    }

    /**
     * Tham gia challenge - cập nhật trạng thái joined thành true.
     * @param {number} communityMemberId - ID của community member.
     * @param {number} postChallengeId - ID của post challenge.
     * @returns {Promise<object>} - Kết quả tham gia challenge.
     * @throws {Error} - Ném lỗi nếu có vấn đề khi tham gia challenge.
     */
    async joinChallenge(communityMemberId, postChallengeId) {
        try {
            // Validate input
            if (!communityMemberId || isNaN(communityMemberId)) {
                throw new Error('Community Member ID không hợp lệ');
            }
            if (!postChallengeId || isNaN(postChallengeId)) {
                throw new Error('Post Challenge ID không hợp lệ');
            }

            // Tìm member challenge
            let memberChallenge = await this.createMemberChallengeRepository
                .getMemberChallengeByMemberAndChallenge(
                    parseInt(communityMemberId),
                    parseInt(postChallengeId)
                );

            // Nếu chưa có, tạo mới
            if (!memberChallenge) {
                memberChallenge = await this.createMemberChallengeRepository
                    .createMemberChallenge({
                        community_member_id: parseInt(communityMemberId),
                        post_challenge_id: parseInt(postChallengeId),
                        joined: true,
                        commented: false
                    });

                return {
                    success: true,
                    message: 'Tham gia challenge thành công',
                    data: memberChallenge,
                    action: 'created_and_joined'
                };
            }

            // Nếu đã có nhưng chưa join, cập nhật trạng thái
            if (!memberChallenge.joined) {
                const updatedMemberChallenge = await this.createMemberChallengeRepository
                    .updateJoinedStatus(memberChallenge.member_challenge_id, true);

                return {
                    success: true,
                    message: 'Tham gia challenge thành công',
                    data: updatedMemberChallenge,
                    action: 'updated_joined'
                };
            }

            // Nếu đã join rồi
            return {
                success: true,
                message: 'Bạn đã tham gia challenge này rồi',
                data: memberChallenge,
                action: 'already_joined'
            };
        } catch (error) {
            throw new Error(`Lỗi trong service khi tham gia challenge: ${error.message}`);
        }
    }

    /**
     * Bình luận challenge - cập nhật trạng thái commented thành true.
     * @param {number} communityMemberId - ID của community member.
     * @param {number} postChallengeId - ID của post challenge.
     * @returns {Promise<object>} - Kết quả bình luận challenge.
     * @throws {Error} - Ném lỗi nếu có vấn đề khi bình luận challenge.
     */
    async commentChallenge(communityMemberId, postChallengeId) {
        try {
            // Validate input
            if (!communityMemberId || isNaN(communityMemberId)) {
                throw new Error('Community Member ID không hợp lệ');
            }
            if (!postChallengeId || isNaN(postChallengeId)) {
                throw new Error('Post Challenge ID không hợp lệ');
            }

            // Tìm member challenge
            let memberChallenge = await this.createMemberChallengeRepository
                .getMemberChallengeByMemberAndChallenge(
                    parseInt(communityMemberId),
                    parseInt(postChallengeId)
                );

            // Nếu chưa có, tạo mới với trạng thái commented = true
            if (!memberChallenge) {
                memberChallenge = await this.createMemberChallengeRepository
                    .createMemberChallenge({
                        community_member_id: parseInt(communityMemberId),
                        post_challenge_id: parseInt(postChallengeId),
                        joined: false,
                        commented: true
                    });

                return {
                    success: true,
                    message: 'Bình luận challenge thành công',
                    data: memberChallenge,
                    action: 'created_and_commented'
                };
            }

            // Nếu đã có nhưng chưa comment, cập nhật trạng thái
            if (!memberChallenge.commented) {
                const updatedMemberChallenge = await this.createMemberChallengeRepository
                    .updateCommentedStatus(memberChallenge.member_challenge_id, true);

                return {
                    success: true,
                    message: 'Bình luận challenge thành công',
                    data: updatedMemberChallenge,
                    action: 'updated_commented'
                };
            }

            // Nếu đã comment rồi
            return {
                success: true,
                message: 'Bạn đã bình luận challenge này rồi',
                data: memberChallenge,
                action: 'already_commented'
            };
        } catch (error) {
            throw new Error(`Lỗi trong service khi bình luận challenge: ${error.message}`);
        }
    }

    /**
     * Rời khỏi challenge - xóa member challenge hoặc cập nhật trạng thái.
     * @param {number} communityMemberId - ID của community member.
     * @param {number} postChallengeId - ID của post challenge.
     * @param {boolean} [deleteRecord=false] - Có xóa hoàn toàn bản ghi hay chỉ cập nhật trạng thái.
     * @returns {Promise<object>} - Kết quả rời khỏi challenge.
     * @throws {Error} - Ném lỗi nếu có vấn đề khi rời khỏi challenge.
     */
    async leaveChallenge(communityMemberId, postChallengeId, deleteRecord = false) {
        try {
            // Validate input
            if (!communityMemberId || isNaN(communityMemberId)) {
                throw new Error('Community Member ID không hợp lệ');
            }
            if (!postChallengeId || isNaN(postChallengeId)) {
                throw new Error('Post Challenge ID không hợp lệ');
            }

            // Tìm member challenge
            const memberChallenge = await this.createMemberChallengeRepository
                .getMemberChallengeByMemberAndChallenge(
                    parseInt(communityMemberId),
                    parseInt(postChallengeId)
                );

            if (!memberChallenge) {
                throw new Error('Bạn chưa tham gia challenge này');
            }

            if (deleteRecord) {
                // Xóa hoàn toàn bản ghi
                await this.createMemberChallengeRepository
                    .deleteMemberChallenge(memberChallenge.member_challenge_id);

                return {
                    success: true,
                    message: 'Rời khỏi challenge thành công',
                    action: 'deleted'
                };
            } else {
                // Chỉ cập nhật trạng thái joined = false
                const updatedMemberChallenge = await this.createMemberChallengeRepository
                    .updateJoinedStatus(memberChallenge.member_challenge_id, false);

                return {
                    success: true,
                    message: 'Rời khỏi challenge thành công',
                    data: updatedMemberChallenge,
                    action: 'updated_left'
                };
            }
        } catch (error) {
            throw new Error(`Lỗi trong service khi rời khỏi challenge: ${error.message}`);
        }
    }

    /**
     * Lấy thông tin member challenge theo member và challenge.
     * @param {number} communityMemberId - ID của community member.
     * @param {number} postChallengeId - ID của post challenge.
     * @returns {Promise<object>} - Thông tin member challenge.
     * @throws {Error} - Ném lỗi nếu có vấn đề khi lấy thông tin.
     */
    async getMemberChallengeInfo(communityMemberId, postChallengeId) {
        try {
            // Validate input
            if (!communityMemberId || isNaN(communityMemberId)) {
                throw new Error('Community Member ID không hợp lệ');
            }
            if (!postChallengeId || isNaN(postChallengeId)) {
                throw new Error('Post Challenge ID không hợp lệ');
            }

            const memberChallenge = await this.createMemberChallengeRepository
                .getMemberChallengeByMemberAndChallenge(
                    parseInt(communityMemberId),
                    parseInt(postChallengeId)
                );

            if (!memberChallenge) {
                return {
                    success: true,
                    message: 'Member chưa tham gia challenge này',
                    data: null,
                    status: {
                        joined: false,
                        commented: false,
                        exists: false
                    }
                };
            }

            return {
                success: true,
                message: 'Lấy thông tin member challenge thành công',
                data: memberChallenge,
                status: {
                    joined: memberChallenge.joined,
                    commented: memberChallenge.commented,
                    exists: true
                }
            };
        } catch (error) {
            throw new Error(`Lỗi trong service khi lấy thông tin member challenge: ${error.message}`);
        }
    }

    /**
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
     * Tạo member challenge với logic thông minh.
     * Tự động xử lý các trường hợp: tạo mới, cập nhật trạng thái, hoặc thông báo đã tồn tại.
     * @param {object} options - Tùy chọn tạo member challenge.
     * @param {number} options.community_member_id - ID của community member.
     * @param {number} options.post_challenge_id - ID của post challenge.
     * @param {boolean} [options.auto_join=false] - Tự động tham gia challenge.
     * @param {boolean} [options.auto_comment=false] - Tự động đánh dấu đã bình luận.
     * @returns {Promise<object>} - Kết quả tạo member challenge thông minh.
     * @throws {Error} - Ném lỗi nếu có vấn đề.
     */
    async smartCreateMemberChallenge(options) {
        try {
            const { community_member_id, post_challenge_id, auto_join = false, auto_comment = false } = options;

            // Validate input
            this.validateMemberChallengeData({
                community_member_id,
                post_challenge_id
            });

            // Kiểm tra member challenge hiện tại
            const existingMemberChallenge = await this.createMemberChallengeRepository
                .getMemberChallengeByMemberAndChallenge(
                    parseInt(community_member_id),
                    parseInt(post_challenge_id)
                );

            if (existingMemberChallenge) {
                // Nếu đã tồn tại, kiểm tra xem có cần cập nhật không
                let needUpdate = false;
                const updates = {};

                if (auto_join && !existingMemberChallenge.joined) {
                    updates.joined = true;
                    needUpdate = true;
                }

                if (auto_comment && !existingMemberChallenge.commented) {
                    updates.commented = true;
                    needUpdate = true;
                }

                if (needUpdate) {
                    let updatedMemberChallenge = existingMemberChallenge;
                    
                    if (updates.joined !== undefined) {
                        updatedMemberChallenge = await this.createMemberChallengeRepository
                            .updateJoinedStatus(existingMemberChallenge.member_challenge_id, updates.joined);
                    }
                    
                    if (updates.commented !== undefined) {
                        updatedMemberChallenge = await this.createMemberChallengeRepository
                            .updateCommentedStatus(existingMemberChallenge.member_challenge_id, updates.commented);
                    }

                    return {
                        success: true,
                        message: 'Cập nhật member challenge thành công',
                        data: updatedMemberChallenge,
                        action: 'updated',
                        changes: updates
                    };
                } else {
                    return {
                        success: true,
                        message: 'Member challenge đã tồn tại',
                        data: existingMemberChallenge,
                        action: 'exists'
                    };
                }
            } else {
                // Tạo mới member challenge
                const newMemberChallenge = await this.createMemberChallengeRepository
                    .createMemberChallenge({
                        community_member_id: parseInt(community_member_id),
                        post_challenge_id: parseInt(post_challenge_id),
                        joined: auto_join,
                        commented: auto_comment
                    });

                return {
                    success: true,
                    message: 'Tạo member challenge thành công',
                    data: newMemberChallenge,
                    action: 'created'
                };
            }
        } catch (error) {
            throw new Error(`Lỗi trong service khi tạo member challenge thông minh: ${error.message}`);
        }
    }
}

module.exports = CreateMemberChallengeService;
