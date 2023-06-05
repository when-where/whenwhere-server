import dotenv from 'dotenv';
dotenv.config();

const env = process.env;

const DEVELOPMENT = {
  host: env.SEQUELIZE_HOST,
  database: env.SEQUELIZE_DATABASE,
  username: env.SEQUELIZE_USERNAME,
  password: env.SEQUELIZE_PASSWORD,
  dialect: env.SEQUELIZE_DIALECT,
};

export default DEVELOPMENT;
