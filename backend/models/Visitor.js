const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Visitor extends Model {
    static associate(models) {
      this.belongsTo(models.Student, { foreignKey: 'studentId' });
    }
  }
  Visitor.init({
    visitorId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    visitorName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    relation: DataTypes.STRING,
    checkInTime: DataTypes.DATE,
    checkOutTime: DataTypes.DATE,
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Students', key: 'studentId' },
    },
  }, {
    sequelize,
    modelName: 'Visitor',
  });
  return Visitor;
};
