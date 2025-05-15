const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Challenge = require('./challenge');
const CommunityMember = require('./communityMember');

const ChallengeComment = sequelize.define('challenge_comments', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    challenge_id: { type: DataTypes.BIGINT, allowNull: false },
    community_member_id: { type: DataTypes.BIGINT },
    comment_text: { type: DataTypes.TEXT, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE }
});

ChallengeComment.belongsTo(Challenge, {
    foreignKey: 'challenge_id',
    as: 'challenge'
});

ChallengeComment.belongsTo(CommunityMember, {
    foreignKey: 'community_member_id',
    as: 'member'
});

module.exports = ChallengeComment;
