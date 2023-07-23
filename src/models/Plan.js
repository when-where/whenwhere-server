import Sequelize from 'sequelize';
import User from './User.js';
import PlanMember from './PlanMember.js';
import PlanDateRange from './PlanDateRange.js';

class Plan extends Sequelize.Model {
  static initiate(sequelize) {
    Plan.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        plan_title: {
          type: Sequelize.STRING(40),
          allowNull: false,
        },
        plan_description: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        connection_type: {
          type: Sequelize.ENUM('online', 'offline'),
          allowNull: false,
        },
        offline_location: {
          type: Sequelize.STRING(40),
          allowNull: true,
        },
        online_link: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },
        start_time: {
          type: Sequelize.TIME,
          allowNull: false,
        },
        end_time: {
          type: Sequelize.TIME,
          allowNull: false,
        },
        plan_status: {
          type: Sequelize.ENUM('조정중', '확정', '종료'),
          allowNull: false,
          defaultValue: '조정중',
        },
        plan_confirm_date: {
          type: Sequelize.DATEONLY(),
          allowNull: true,
        },
        plan_confirm_time: {
          type: Sequelize.TIME(),
          allowNull: true,
        },
        plan_confirm_location: {
          type: Sequelize.STRING(40),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        modelName: 'Plan',
        tableName: 'plan',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate() {
    Plan.belongsTo(User);
    Plan.hasMany(PlanMember);
    Plan.hasMany(PlanDateRange);
  }
}

export default Plan;
