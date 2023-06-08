import Sequelize from 'sequelize';
import DEVELOPMENT from '../config/config.js';
import User from './User.js';

const db = {};

export const sequelize = new Sequelize(
  DEVELOPMENT.database,
  DEVELOPMENT.username,
  DEVELOPMENT.password,
  {
    database: DEVELOPMENT.database,
    username: DEVELOPMENT.username,
    password: DEVELOPMENT.password,
    host: DEVELOPMENT.host,
    dialect: DEVELOPMENT.dialect,
  }
);

db.sequelize = sequelize;

User.initiate(sequelize);

User.associate(db);

export default db;
