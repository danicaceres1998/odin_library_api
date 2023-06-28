'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BookInstances', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      book_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Books', key: 'id' },
        onDelete: 'CASCADE'
      },
      imprint: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        default: false
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM('available', 'sold_out', 'coming_soon'),
        default: 'available'
      },
      url: {
        allowNull: true,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('BookInstances');
  }
};