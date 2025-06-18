module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
        post_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        ten_posts: {
            type: DataTypes.STRING,
            allowNull: false
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        status: {
            type: DataTypes.ENUM('draft', 'published', 'archived', 'deleted'),
            defaultValue: 'draft'
        },
        published_at: {
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
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        url: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        user_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user_avatar_url: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        likes_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        comments_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }, {
        tableName: 'posts',
        underscored: true,
        timestamps: false
    });

    Post.associate = (models) => {
        // Quan hệ với CommunityMember (user)
        Post.belongsTo(models.CommunityMember, {
            foreignKey: 'user_id',
            as: 'author'
        });

        // Quan hệ với Comment (một post có nhiều comment)
        Post.hasMany(models.Comment, {
            foreignKey: 'post_id',
            as: 'comments'
        });
    };

    return Post;
};
