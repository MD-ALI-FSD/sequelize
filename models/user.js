//Importing Sequelize Class and Object
const Sequelize = require("sequelize");
const sequelize = require("../util/database");

//Creating User modal(modal of the object)
const user = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  email: Sequelize.STRING,
});

module.exports = user;
