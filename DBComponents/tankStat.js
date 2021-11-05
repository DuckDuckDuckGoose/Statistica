const {DataTypes} = require(`sequelize`);
module.exports = {
  modelName: `tankStat`,
  account_id: {
    type: DataTypes.INTEGER,
    unique: `comp`
  },
  tank_id: {
    type: DataTypes.INTEGER,
    unique: `comp`
  },
  battles: DataTypes.INTEGER,
  wins: DataTypes.INTEGER,
  damage_dealt: DataTypes.INTEGER,
  timeStamps: true,
  createdAt: true,
  updatedAt: true
}
