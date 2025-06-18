module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
        comment_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        event_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        community_member_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        parent_comment_id: {
            type: DataTypes.BIGINT,
            allowNull: true,
            comment: 'For reply comments'
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('active', 'deleted', 'hidden'),
            defaultValue: 'active'
        },
        likes_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        is_edited: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'comments',
        underscored: true,
        timestamps: false
    });

    Comment.associate = (models) => {
        // Quan hệ với Event
        Comment.belongsTo(models.Event, {
            foreignKey: 'event_id',
            as: 'event'
        });

        // Quan hệ với CommunityMember
        Comment.belongsTo(models.CommunityMember, {
            foreignKey: 'community_member_id',
            as: 'author'
        });

        // Quan hệ tự tham chiếu cho reply comments
        Comment.belongsTo(models.Comment, {
            foreignKey: 'parent_comment_id',
            as: 'parent_comment'
        });

        Comment.hasMany(models.Comment, {
            foreignKey: 'parent_comment_id',
            as: 'replies'
        });
    };

    return Comment;
};
