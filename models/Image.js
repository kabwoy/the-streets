const {DataTypes} = require("sequelize")

const sequelize = require("../db/con")

const Image = sequelize.define('image' , {

    id:{

        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },

    image_src:{
        type:DataTypes.TEXT,
        allowNull:false
    }
})

module.exports = Image