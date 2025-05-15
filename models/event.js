const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CommunityMember = sequelize.define('community_members', {
    id: { type: DataTypes.BIGINT, primaryKey: true },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    headline: DataTypes.TEXT,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    last_seen_at: DataTypes.DATE,
    profile_confirmed_at: DataTypes.DATE,
    community_id: DataTypes.BIGINT,
    profile_url: DataTypes.TEXT,
    public_uid: DataTypes.STRING,
    profile_fields: DataTypes.JSON,
    pages: DataTypes.JSON
});

module.exports = CommunityMember;
