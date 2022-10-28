const {Sequelize} = require("sequelize")

const sequelize = new Sequelize({username:"kaboi" , password:"kaboi" , database:"streets" , dialect:"mysql" , host:"localhost"})

module.exports = sequelize