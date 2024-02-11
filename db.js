const {Sequelize} = require('sequelize')
const { db_password: dbPassword } = require('./db.password')

module.exports = new Sequelize(
    'telegram_bot',
    'postgres',
    dbPassword,
    {
        host: 'localhost',
        port: '5432',
        dialect: 'postgres'
    }
)
