import Sequelize from 'sequelize';
import User from './User.js';
import Plan from './Plan.js';

class PlanMember extends Sequelize.Model {
  static initiate(sequelize) {
    PlanMember.init(
      {
        plan_member_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        user_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          allowNull: false,
        },
        plan_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        modelName: 'PlanMember',
        tableName: 'plan_member',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate() {
    PlanMember.belongsTo(User, { targetKey: 'id', foreignKey: 'user_id' });
    PlanMember.belongsTo(Plan, { targetKey: 'plan_id', foreignKey: 'plan_id' });
  }
}

export default PlanMember;
