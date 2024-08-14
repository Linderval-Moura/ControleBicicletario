
const dbConfig = require("../config/sequelize-config");
const Messages = require("../utils/messages");
const { DataTypes, Model } = require("sequelize");

class Tranca extends Model{}

Tranca.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    numero: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    localizacao: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ano_de_fabricacao: {
        type: DataTypes.STRING,
        allowNull:  false,
    },
    modelo: {
        type: DataTypes.STRING,
        allowNull:  false,
    },
    status: {
        type: DataTypes.ENUM(
            'LIVRE',
            'OCUPADA',
            'NOVA',
            'APOSENTADA',
            'EM_REPARO'
        ),
        allowNull:  false,
    },
    bicicleta: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'bicicletas',
            key: 'id',
          },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
    },
},
{
    sequelize: dbConfig,
    tableName: "trancas",
    timestamps: true,
    underscored: true,
    underscoredAll: true,
});

module.exports = Tranca;