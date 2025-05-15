const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const CommunityMember = require('./communityMember');

const Challenge = sequelize.define('challenges', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  reward_type: {
    type: DataTypes.ENUM('points', 'voucher', 'badge', 'other'),
    defaultValue: 'points'
  },
  reward_value: DataTypes.STRING,
  due_date: DataTypes.DATE,
  status: {
    type: DataTypes.ENUM('pending', 'done'),
    defaultValue: 'pending'
  },
  is_weekly: { type: DataTypes.BOOLEAN, defaultValue: false },
  recurrence_rule: DataTypes.JSON,
  community_member_id: { type: DataTypes.BIGINT, allowNull: false },
  comments_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

Challenge.belongsTo(CommunityMember, {
  foreignKey: 'community_member_id',
  as: 'member'
});

module.exports = Challenge;
