
/**
 * @Author - ViiktorHugo
 * @description - Singleton para configurar o sequelize com os dados do servidor
 */

const { Sequelize } = require('sequelize');
const config = require('./config')

const sequelize = new Sequelize(
    config[process.env.NODE_ENV].database,
    config[process.env.NODE_ENV].username,
    config[process.env.NODE_ENV].password,
    {
        host: config[process.env.NODE_ENV].host,
        port: config[process.env.NODE_ENV].port,
        dialect: config[process.env.NODE_ENV].dialect,
    }
)

module.exports = sequelize;