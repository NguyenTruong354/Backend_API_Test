const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MemberChallenge = sequelize.define('member_challenges', {
  member_challenge_id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  community_member_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  post_challenge_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  joined: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  commented: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'member_challenges',
  timestamps: false,
});

module.exports = MemberChallenge;
