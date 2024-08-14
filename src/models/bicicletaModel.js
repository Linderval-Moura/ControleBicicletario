const { Model, DataTypes } = require('sequelize');
const sqConfig = require('../config/sequelize-config');

/**
 * @Author - ViiktorHugo
 * @description - Modelo para criação do objeto bicicleta
 */

class Bicicleta extends Model {
}

Bicicleta.init( {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    marca: {
        type: DataTypes.STRING,
        allowNull: false
    },
    modelo: {
        type: DataTypes.STRING,
        allowNull : false
    },
    ano: {
        type: DataTypes.STRING(4),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM(
            "DISPONIVEL",
            "EM_USO",
            "NOVA",
            "APOSENTADA",
            "REPARO_SOLICITADO",
            "EM_REPARO"
        ),
        allowNull: false
    }
},
{
    sequelize: sqConfig,
    modelName: "bicicleta",
    tableName: "bicicletas",
    timestamps: true,
    underscored: true,
    underscoredAll: true,
});

module.exports = Bicicleta;