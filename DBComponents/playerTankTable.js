const {DataTypes} = require(`sequelize`);
module.exports = {
  modelName: `playerTank`,
  attributes: {
    account_id: DataTypes.INTEGER,
    tank_id: DataTypes.INTEGER
  },
  options: {}
}
