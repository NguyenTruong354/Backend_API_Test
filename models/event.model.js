const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Event = sequelize.define("Event", {
    event_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    },
    ten_events: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    host: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    community_member_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    in_person_location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    starts_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    ends_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cover_image_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    max_attendees: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            max: 300,
        },
    },
    current_attendees: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM("upcoming", "ongoing", "finished", "cancelled"),
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    location_URL: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: "events",
    timestamps: false,
});

module.exports = Event;
