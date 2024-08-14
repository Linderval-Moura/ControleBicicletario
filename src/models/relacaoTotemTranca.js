
const dbConfig = require("../config/sequelize-config");
const { DataTypes, Model } = require("sequelize");

class RelacaoTotemTranca extends Model {}

RelacaoTotemTranca.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        totem_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        tranca_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        sequelize: dbConfig,
        modelName: 'relacao_totem_tranca',
        tableName: 'relacao_totem_tranca',
        timestamps: true,
        underscored: true,
        underscoredALL: true,
    }
);

module.exports = RelacaoTotemTranca;