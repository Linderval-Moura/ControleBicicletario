'use strict';
/**
 * @Author - ViiktorHugo
 * @description - Migration file para bicicleta
 */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('bicicletas', { 
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      marca: {
        type: Sequelize.STRING,
        allowNull: false
      },
      modelo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      ano: {
        type: Sequelize.STRING(4),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM(
          'DISPONIVEL',
          'EM_USO',
          'NOVA',
          'APOSENTADA',
          'REPARO_SOLICITADO',
          'EM_REPARO'
        ),
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('bicicletas');
  }
};
