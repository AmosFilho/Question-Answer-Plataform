const Sequelize = require("sequelize");

const connection = new Sequelize('guiaperguntas', 'root', 'Listhejustice17', {
    host:'localhost',
    dialect: 'mysql',
    logging: false
});
  
module.exports = connection;