class PostChallengeRepository {
    constructor(models) {
        this.models = models;
    }

    /**
     * Lấy tất cả danh sách PostChallenge.
     * @returns {Promise<Array<object>>} - Danh sách tất cả PostChallenge.
     * @throws {Error} - Ném lỗi nếu có vấn đề khi lấy danh sách PostChallenge.
     */
    async getAllPostChallenges() {
        try {
            const postChallenges = await this.models.PostChallenge.findAll({
                include: [
                    { model: this.models.Post, as: 'Post' },
                    { model: this.models.Event, as: 'Event' }
                ],
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

            const postChallenge = await this.models.PostChallenge.findByPk(id, {
                include: [
                    { model: this.models.Post, as: 'Post' },
                    { model: this.models.Event, as: 'Event' }
                ]
            });

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