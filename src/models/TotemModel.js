const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/sequelize-config");
const Tranca = require("./tranca");

class Totem extends Model {
}
Totem.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  marca: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  modelo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ano_aquisicao: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  localizacao: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: false
  },
},
{
  sequelize: sequelize,
  modelName: "totem",
  tableName: "totens",
  timestamps: true,
  underscored: true,
  underscoredAll: true,
});

module.exports = Totem;