import Sequelize from 'sequelize';
import Plan from './Plan.js';
import PlanMember from './PlanMember.js';

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
        password: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        is_valid: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        confirmation_code: {
          type: Sequelize.STRING(200),
          allowNull: true,
          unique: true,
        },
        social_id: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        is_profile: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        nickname: {
          type: Sequelize.STRING(20),
          allowNull: true,
        },
        description: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
        provider: {
          type: Sequelize.ENUM('local', 'kakao'),
          allowNull: false,
          defaultValue: 'local',
        },
        profile_color: {
          type: Sequelize.STRING(7),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        modelName: 'User',
        tableName: 'user',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate() {
    User.hasMany(Plan);
    User.hasMany(PlanMember);
  }
}

export default User;
