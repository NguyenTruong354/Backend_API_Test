const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('data_apilothub', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    define: {
        freezeTableName: true,
        timestamps: false
    }
});

module.exports = sequelize;
