const Sequelize = require("sequelize");
require("dotenv").config();


const connection = new Sequelize('guiaperguntas', 'root', process.env.SQL_PASSWORD, {
    host:'localhost',
    dialect: 'mysql',
    logging: false
});
  
module.exports = connection;