import Sequelize from 'sequelize';

class User extends Sequelize.Model {
  static initiate(sequelize) {
    User.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        email: {
          type: Sequelize.STRING(40),
          allowNull: true,
          unique: true,
        },
        nickname: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        provider: {
          type: Sequelize.ENUM('local', 'kakao'),
          allowNull: false,
          defaultValue: 'local',
        },
        social_id: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        access_token: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        refresh_token: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        profile_image: {
          type: Sequelize.BLOB('medium'),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'User',
        tableName: 'user',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {}
}

export default User;
