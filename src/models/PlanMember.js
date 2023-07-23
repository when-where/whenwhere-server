import Sequelize from 'sequelize';
import User from './User.js';
import Plan from './Plan.js';

class PlanMember extends Sequelize.Model {
  static initiate(sequelize) {
    PlanMember.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
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
    PlanMember.belongsTo(User);
    PlanMember.belongsTo(Plan);
  }
}

export default PlanMember;
