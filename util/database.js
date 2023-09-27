const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "a9431453655@A", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
