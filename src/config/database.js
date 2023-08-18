const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    dialect: 'oracle',
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialectOptions: {
      connectString: `(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=${process.env.DATABASE_HOST})(PORT=${process.env.DATABASE_PORT}))(CONNECT_DATA=(SID=${process.env.DATABASE_SID})))`,
    },
  }
);

module.exports = sequelize;
