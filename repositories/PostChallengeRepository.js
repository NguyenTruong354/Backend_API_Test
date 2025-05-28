const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

// Định nghĩa model PostChallenge
const PostChallenge = sequelize.define('PostChallenge', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    type: {
        type: DataTypes.ENUM('comment', 'event'),
        allowNull: false
    },
    promo_id: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    challenge_id: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    post_id: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    event_id: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    is_show: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    points_reward: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    due_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'post_challenges',
    underscored: true,
    timestamps: false
});

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