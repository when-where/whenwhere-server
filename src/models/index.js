import Sequelize from 'sequelize';
import DEVELOPMENT from '../config/config.js';
import fs from 'fs';
import path from 'path';

const db = {};

export const sequelize = new Sequelize.Sequelize(
  DEVELOPMENT.database,
  DEVELOPMENT.username,
  DEVELOPMENT.password,
  {
    host: DEVELOPMENT.host,
    dialect: DEVELOPMENT.dialect,
  }
);

db.sequelize = sequelize;

const __filename = path.basename(import.meta.url);
const __dirname = path.dirname(__filename);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      !file.includes('test') &&
      file !== __filename &&
      file.slice(-3) === '.js'
    );
  })
  .forEach(async (file) => {
    // 해당 파일의 모델 불러와서 init
    const model = await import(path.join(__dirname, file));
    db[model.name] = model;
    model.initiate(sequelize);
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

export default db;
