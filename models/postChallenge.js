module.exports = (sequelize, DataTypes) => {
    const PostChallenge = sequelize.define('PostChallenge', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: DataTypes.ENUM('comment', 'event'),
            allowNull: false
        },
        promo_id: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        challenge_id: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        post_id: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        event_id: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        is_show: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        points_reward: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        due_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
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
        underscored: true,
        timestamps: false
    });

    PostChallenge.associate = (models) => {
        PostChallenge.belongsTo(models.Post, { foreignKey: 'post_id' });
        PostChallenge.belongsTo(models.Event, { foreignKey: 'event_id' });
    };

    return PostChallenge;
};
