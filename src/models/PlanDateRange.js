import Sequelize from 'sequelize';
import Plan from './Plan.js';

class PlanDateRange extends Sequelize.Model {
  static initiate(sequelize) {
    PlanDateRange.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        date: {
          type: Sequelize.DATEONLY(),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        modelName: 'PlanDateRange',
        tableName: 'plan_date_range',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate() {
    PlanDateRange.belongsTo(Plan);
  }
}

export default PlanDateRange;
