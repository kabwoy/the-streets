const {Sequelize , DataTypes} = require("sequelize")
const sequelize = require("../db/con")

const User = sequelize.define('user' , {

    id:{

        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false,
    },

    email:{

        type:DataTypes.TEXT,
        allowNull:false,
        unique:true
    },

    password:{

        type:DataTypes.TEXT,
        allowNull:false
    },

    isAdmin:{

        type:DataTypes.BOOLEAN,
        defaultValue:false,

    }

})

module.exports = User