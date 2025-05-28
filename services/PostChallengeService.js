class PostChallengeService {
    constructor(postChallengeRepository) {
        this.postChallengeRepository = postChallengeRepository;
    }

    /**
     * Lấy tất cả danh sách PostChallenge.
     * @returns {Promise<Array<object>>} - Danh sách tất cả PostChallenge.
     * @throws {Error} - Ném lỗi nếu có vấn đề khi lấy danh sách.
     */
    async getAllPostChallenges() {
        try {
            return await this.postChallengeRepository.getAllPostChallenges();
        } catch (error) {
            throw new Error(`Lỗi service khi lấy danh sách PostChallenge: ${error.message}`);
        }
    }

    /**
     * Lấy một PostChallenge theo ID.
     * @param {number|string} id - ID của PostChallenge.
     * @returns {Promise<object>} - Đối tượng PostChallenge.
     * @throws {Error} - Ném lỗi nếu không tìm thấy hoặc có lỗi truy vấn.
     */
    async getPostChallengeById(id) {
        try {
            return await this.postChallengeRepository.getPostChallengeById(id);
        } catch (error) {
            throw new Error(`Lỗi service khi lấy PostChallenge theo ID: ${error.message}`);
        }
    }
}

module.exports = PostChallengeService;