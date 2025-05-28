const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: process.env.DB_LOGGING === 'true' ? console.log : false,
        define: {
            freezeTableName: true,
            timestamps: false
        },
        pool: {
            max: parseInt(process.env.DB_POOL_MAX || '5'),
            min: parseInt(process.env.DB_POOL_MIN || '0'),
            acquire: parseInt(process.env.DB_POOL_ACQUIRE || '30000'),
            idle: parseInt(process.env.DB_POOL_IDLE || '10000')
        }
    }
);

// Kiểm tra kết nối database khi khởi động
sequelize
    .authenticate()
    .then(() => {
        console.log('Kết nối database thành công.');
    })
    .catch(err => {
        console.error('Lỗi kết nối database:', err);
    });

module.exports = sequelize;
