import Sequelize from 'sequelize';
import DEVELOPMENT from '../config/config.js';
import User from './User.js';

const db = {};

export const sequelize = new Sequelize(
  DEVELOPMENT.database,
  DEVELOPMENT.username,
  DEVELOPMENT.password,
  {
    host: DEVELOPMENT.host,
    dialect: DEVELOPMENT.dialect,
    timezone: '+09:00', // DB에 저장할 때 시간 설정
    dialectOptions: {
      timezone: '+09:00', // DB에서 가져올 때 시간 설정
    },
  }
);

db.sequelize = sequelize;

User.initiate(sequelize);

User.associate(db);

export default db;
