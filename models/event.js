const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Event = sequelize.define('Event', {
    event_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    ten_events: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false
    },
    host: {
        type: DataTypes.STRING
    },
    community_member_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    in_person_location: {
        type: DataTypes.TEXT
    },
    starts_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    ends_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    cover_image_url: {
        type: DataTypes.TEXT
    },
    description: {
        type: DataTypes.TEXT
    },
    price: {
        type: DataTypes.STRING(50)
    },
    ticket_type: {
        type: DataTypes.ENUM('free', 'paid', 'donation'),
        defaultValue: 'free'
    },
    max_attendees: {
        type: DataTypes.INTEGER
    },
    current_attendees: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    status: {
        type: DataTypes.ENUM('upcoming', 'ongoing', 'finished', 'cancelled'),
        defaultValue: 'upcoming'
    },
    category: {
        type: DataTypes.STRING(100)
    },
    location_url: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'events',
    underscored: true,
    timestamps: false
});

module.exports = Event;
