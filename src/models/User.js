import Sequelize from 'sequelize';

class User extends Sequelize.Model {
  static initiate(sequelize) {
    User.init(
      {
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
          type: Sequelize.STRING(32),
          allowNull: true,
        },
        provider: {
          type: Sequelize.ENUM('local', 'kakao'),
          allowNull: false,
          defaultValue: 'local',
        },
        profileImage: {
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
