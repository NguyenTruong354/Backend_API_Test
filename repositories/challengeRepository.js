const Challenge = require('../models/challenge');
const { Op } = require('sequelize');

class ChallengeRepository {
    /**
     * Tạo một thử thách mới.
     * @param {object} challengeData - Dữ liệu của thử thách cần tạo.
     * @returns {Promise<object>} - Đối tượng thử thách đã được tạo.
     * @throws {Error} - Ném lỗi nếu có vấn đề khi tạo thử thách.
     */
    async createChallenge(challengeData) {
        try {
            if (!challengeData || typeof challengeData !== 'object') {
                throw new Error('Dữ liệu thử thách không hợp lệ');
            }

            const requiredFields = ['title', 'description', 'community_member_id'];
            for (const field of requiredFields) {
                if (!challengeData[field]) {
                    throw new Error(`Trường ${field} là bắt buộc`);
                }
            }

            const challenge = await Challenge.create(challengeData);
            return challenge.toJSON();
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                throw new Error(`Lỗi validation: ${error.message}`);
            }
            throw new Error(`Lỗi khi tạo thử thách: ${error.message}`);
        }
    }

    /**
     * Lấy tất cả các thử thách với các bộ lọc tùy chọn và phân trang.
     * @param {object} options - Các tùy chọn lọc và phân trang.
     * @param {object} options.filters - Các điều kiện lọc.
     * @param {number} options.page - Trang hiện tại (mặc định: 1).
     * @param {number} options.limit - Số lượng bản ghi mỗi trang (mặc định: 10).
     * @returns {Promise<{data: Array<object>, pagination: object}>} - Dữ liệu và thông tin phân trang.
     * @throws {Error} - Ném lỗi nếu có vấn đề khi lấy danh sách thử thách.
     */
    async getAllChallenges({ filters = {}, page = 1, limit = 10 } = {}) {
        try {
            const whereClause = {};

            if (filters.status) {
                whereClause.status = filters.status;
            }
            if (filters.community_member_id) {
                whereClause.community_member_id = filters.community_member_id;
            }
            if (filters.is_weekly !== undefined) {
                whereClause.is_weekly = filters.is_weekly;
            }

            const offset = (page - 1) * limit;

            const { count, rows } = await Challenge.findAndCountAll({
                where: whereClause,
                order: [['created_at', 'DESC']],
                limit,
                offset,
            });

            return {
                data: rows.map(challenge => challenge.toJSON()),
                pagination: {
                    total: count,
                    page,
                    limit,
                    totalPages: Math.ceil(count / limit)
                }
            };
        } catch (error) {
            throw new Error(`Lỗi khi lấy danh sách thử thách: ${error.message}`);
        }
    }

    /**
     * Lấy một thử thách cụ thể bằng ID.
     * @param {number|string} id - ID của thử thách.
     * @returns {Promise<object>} - Đối tượng thử thách.
     * @throws {Error} - Ném lỗi nếu không tìm thấy thử thách hoặc có lỗi truy vấn.
     */
    async getChallengeById(id) {
        try {
            if (!id) {
                throw new Error('ID thử thách không được để trống');
            }

            const challenge = await Challenge.findByPk(id);

            if (!challenge) {
                throw new Error('Không tìm thấy thử thách với ID đã cho.');
            }
            return challenge.toJSON();
        } catch (error) {
            if (error.message === 'Không tìm thấy thử thách với ID đã cho.') {
                throw error;
            }
            throw new Error(`Lỗi khi lấy thử thách theo ID: ${error.message}`);
        }
    }

    /**
     * Cập nhật thông tin một thử thách.
     * @param {number|string} id - ID của thử thách cần cập nhật.
     * @param {object} updateData - Dữ liệu cần cập nhật.
     * @returns {Promise<object>} - Đối tượng thử thách sau khi đã cập nhật.
     * @throws {Error} - Ném lỗi nếu không tìm thấy thử thách hoặc có lỗi khi cập nhật.
     */
    async updateChallenge(id, updateData) {
        try {
            if (!id) {
                throw new Error('ID thử thách không được để trống');
            }

            if (!updateData || typeof updateData !== 'object') {
                throw new Error('Dữ liệu cập nhật không hợp lệ');
            }

            const challenge = await Challenge.findByPk(id);
            if (!challenge) {
                throw new Error('Không tìm thấy thử thách để cập nhật.');
            }

            // Danh sách các trường được phép cập nhật
            const allowedFields = [
                'title',
                'description',
                'reward_type',
                'reward_value',
                'due_date',
                'status',
                'is_weekly',
                'recurrence_rule'
            ];

            // Lọc chỉ những trường được phép cập nhật
            const filteredUpdateData = Object.keys(updateData)
                .filter(key => allowedFields.includes(key))
                .reduce((obj, key) => {
                    obj[key] = updateData[key];
                    return obj;
                }, {});

            const updatedChallenge = await challenge.update(filteredUpdateData);
            return updatedChallenge.toJSON();
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                throw new Error(`Lỗi validation: ${error.message}`);
            }
            throw new Error(`Lỗi khi cập nhật thử thách: ${error.message}`);
        }
    }

    /**
     * Xóa một thử thách.
     * @param {number|string} id - ID của thử thách cần xóa.
     * @returns {Promise<{id: number|string, deleted: boolean}>} - Thông tin về việc xóa.
     * @throws {Error} - Ném lỗi nếu không tìm thấy thử thách hoặc có lỗi khi xóa.
     */
    async deleteChallenge(id) {
        try {
            if (!id) {
                throw new Error('ID thử thách không được để trống');
            }

            const challenge = await Challenge.findByPk(id);
            if (!challenge) {
                throw new Error('Không tìm thấy thử thách để xóa.');
            }

            await challenge.destroy();
            return { id, deleted: true, message: 'Thử thách đã được xóa thành công.' };
        } catch (error) {
            throw new Error(`Lỗi khi xóa thử thách: ${error.message}`);
        }
    }

    /**
     * Tìm kiếm thử thách theo tiêu đề hoặc mô tả với phân trang.
     * @param {string} searchTerm - Từ khóa tìm kiếm.
     * @param {object} options - Tùy chọn phân trang.
     * @param {number} options.page - Trang hiện tại (mặc định: 1).
     * @param {number} options.limit - Số lượng bản ghi mỗi trang (mặc định: 10).
     * @returns {Promise<{data: Array<object>, pagination: object}>} - Kết quả tìm kiếm và thông tin phân trang.
     * @throws {Error} - Ném lỗi nếu có vấn đề khi tìm kiếm.
     */
    async searchChallenges(searchTerm, { page = 1, limit = 10 } = {}) {
        try {
            if (!searchTerm || typeof searchTerm !== 'string' || searchTerm.trim() === '') {
                return { data: [], pagination: { total: 0, page, limit, totalPages: 0 } };
            }

            const offset = (page - 1) * limit;

            const { count, rows } = await Challenge.findAndCountAll({
                where: {
                    [Op.or]: [
                        { title: { [Op.like]: `%${searchTerm}%` } },
                        { description: { [Op.like]: `%${searchTerm}%` } }
                    ]
                },
                order: [['created_at', 'DESC']],
                limit,
                offset,
            });

            return {
                data: rows.map(challenge => challenge.toJSON()),
                pagination: {
                    total: count,
                    page,
                    limit,
                    totalPages: Math.ceil(count / limit)
                }
            };
        } catch (error) {
            throw new Error(`Lỗi khi tìm kiếm thử thách: ${error.message}`);
        }
    }

    /**
     * Lấy thử thách theo trạng thái với phân trang.
     * @param {string} status - Trạng thái của thử thách.
     * @param {object} options - Tùy chọn phân trang.
     * @param {number} options.page - Trang hiện tại (mặc định: 1).
     * @param {number} options.limit - Số lượng bản ghi mỗi trang (mặc định: 10).
     * @returns {Promise<{data: Array<object>, pagination: object}>} - Kết quả và thông tin phân trang.
     * @throws {Error} - Ném lỗi nếu có vấn đề khi truy vấn.
     */
    async getChallengesByStatus(status, { page = 1, limit = 10 } = {}) {
        try {
            if (!status) {
                throw new Error('Trạng thái không được để trống.');
            }

            const offset = (page - 1) * limit;

            const { count, rows } = await Challenge.findAndCountAll({
                where: { status },
                order: [['created_at', 'DESC']],
                limit,
                offset,
            });

            return {
                data: rows.map(challenge => challenge.toJSON()),
                pagination: {
                    total: count,
                    page,
                    limit,
                    totalPages: Math.ceil(count / limit)
                }
            };
        } catch (error) {
            throw new Error(`Lỗi khi lấy thử thách theo trạng thái: ${error.message}`);
        }
    }
}

module.exports = new ChallengeRepository();
