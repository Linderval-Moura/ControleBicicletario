'use strict';
/**
 * @Author - Pedro
 * @description - Migration file para trancas
 */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('trancas', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      numero: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      localizacao: {
        type: Sequelize.STRING,
        allowNull: false
      },
      ano_de_fabricacao: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      modelo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM(
          'LIVRE',
          'OCUPADA',
          'NOVA',
          'APOSENTADA',
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
      bicicleta: { //aguardando integracao
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'bicicletas',
            key: 'id',
          },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('trancas');
  }
};
