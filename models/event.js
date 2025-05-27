const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const CommunityMember = require('./communityMember');

const Event = sequelize.define('events', {
    id: { type: DataTypes.BIGINT, primaryKey: true },
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    user_id: DataTypes.BIGINT,
    community_member_id: DataTypes.BIGINT,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    starts_at: DataTypes.DATE,
    ends_at: DataTypes.DATE,
    duration_in_seconds: DataTypes.INTEGER,
    location_type: DataTypes.STRING,
    url: DataTypes.TEXT,
    member_email: DataTypes.STRING,
    member_name: DataTypes.STRING,
    body: DataTypes.TEXT,
    zapier_display_title: DataTypes.STRING,
    likes_count: DataTypes.INTEGER,
    comments_count: DataTypes.INTEGER,
    member_avatar_base64: DataTypes.TEXT('long'),
    cover_image_base64: DataTypes.TEXT('long'),
    space_id: DataTypes.BIGINT,
    space_slug: DataTypes.STRING,
    space_name: DataTypes.STRING,
    space_community_id: DataTypes.BIGINT
});

Event.belongsTo(CommunityMember, {
    foreignKey: 'community_member_id',
    as: 'member'
});

module.exports = Event;
