import Sequelize from 'sequelize';
import Plan from './Plan.js';

class PlanDateRange extends Sequelize.Model {
  static initiate(sequelize) {
    PlanDateRange.init(
      {
        plan_date_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        date: {
          type: Sequelize.DATEONLY(),
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
        modelName: 'PlanDateRange',
        tableName: 'plan_date_range',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate() {
    PlanDateRange.belongsTo(Plan, { targetKey: 'plan_id', foreignKey: 'plan_id' });
  }
}

export default PlanDateRange;
