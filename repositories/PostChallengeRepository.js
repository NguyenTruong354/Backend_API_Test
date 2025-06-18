const { Op } = require('sequelize');
const PostChallenge = require('../models/postChallenge');
const Event = require('../models/event');
const Post = require('../models/post');

class PostChallengeRepository {
    constructor() {
        this.model = PostChallenge;
        this.Event = Event;
        this.Post = Post;
    }/**
     * Lấy tất cả danh sách PostChallenge.
     * @returns {Promise<Array<object>>} - Danh sách tất cả PostChallenge.
     * @throws {Error} - Ném lỗi nếu có vấn đề khi lấy danh sách PostChallenge.
     */    async getAllPostChallenges() {
        try {
            // Lấy tất cả PostChallenge 
            const postChallenges = await this.model.findAll({
                attributes: { exclude: ['challenge_id'] },
                order: [['created_at', 'DESC']]
            });

            // Chuyển đổi thành JSON và thêm thông tin liên quan
            const result = [];
            for (const pc of postChallenges) {
                const pcData = pc.toJSON();
                
                // Nếu có event_id, lấy thông tin event
                if (pcData.event_id) {
                    try {
                        const event = await this.Event.findByPk(pcData.event_id);
                        pcData.event = event ? event.toJSON() : null;
                    } catch (err) {
                        pcData.event = null;
                    }
                }
                
                // Nếu có post_id, lấy thông tin post
                if (pcData.post_id) {
                    try {
                        const post = await this.Post.findByPk(pcData.post_id);
                        pcData.post = post ? post.toJSON() : null;
                    } catch (err) {
                        pcData.post = null;
                    }
                }
                
                result.push(pcData);
            }
            
            return result;
        } catch (error) {
            throw new Error(`Lỗi khi lấy danh sách PostChallenge: ${error.message}`);
        }
    }/**
     * Lấy một PostChallenge cụ thể bằng ID.
     * @param {number|string} id - ID của PostChallenge.
     * @returns {Promise<object>} - Đối tượng PostChallenge.
     * @throws {Error} - Ném lỗi nếu không tìm thấy PostChallenge hoặc có lỗi truy vấn.
     */    async getPostChallengeById(id) {
        try {
            if (!id) {
                throw new Error('ID PostChallenge không được để trống');
            }

            const postChallenge = await this.model.findByPk(id, {
                attributes: { exclude: ['challenge_id'] }
            });

            if (!postChallenge) {
                throw new Error('Không tìm thấy PostChallenge với ID đã cho.');
            }
            
            const pcData = postChallenge.toJSON();
            
            // Nếu có event_id, lấy thông tin event
            if (pcData.event_id) {
                try {
                    const event = await this.Event.findByPk(pcData.event_id);
                    pcData.event = event ? event.toJSON() : null;
                } catch (err) {
                    pcData.event = null;
                }
            }
            
            // Nếu có post_id, lấy thông tin post
            if (pcData.post_id) {
                try {
                    const post = await this.Post.findByPk(pcData.post_id);
                    pcData.post = post ? post.toJSON() : null;
                } catch (err) {
                    pcData.post = null;
                }
            }
            
            return pcData;
        } catch (error) {
            if (error.message === 'Không tìm thấy PostChallenge với ID đã cho.') {
                throw error;
            }
            throw new Error(`Lỗi khi lấy PostChallenge theo ID: ${error.message}`);
        }
    }
}

module.exports = PostChallengeRepository;