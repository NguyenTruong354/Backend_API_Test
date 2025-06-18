const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PostChallenge = sequelize.define('post_challenges', {
  post_challenge_id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  type: {
    type: DataTypes.ENUM('comment', 'event'),
    allowNull: false
  },
  promo_id: { type: DataTypes.BIGINT },
  challenge_id: { type: DataTypes.BIGINT },
  post_id: { type: DataTypes.BIGINT },
  event_id: { type: DataTypes.BIGINT },
  is_show: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  points_reward: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  due_date: { type: DataTypes.DATE },
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
  timestamps: false,
  indexes: [
    { fields: ['type'] },
    { fields: ['post_id'] },
    { fields: ['event_id'] },
    { fields: ['due_date'] },
    { fields: ['is_show'] }
  ]
});

// Nếu cần thêm mối quan hệ với các bảng khác, thêm vào đây:
// PostChallenge.belongsTo(Post, { foreignKey: 'post_id', as: 'post' });
// PostChallenge.belongsTo(Event, { foreignKey: 'event_id', as: 'event' });

module.exports = PostChallenge;
