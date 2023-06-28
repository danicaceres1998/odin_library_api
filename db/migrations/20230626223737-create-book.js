'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Books', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      author_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Authors', key: 'id' },
        onDelete: 'CASCADE'
      },
      summary: {
        allowNull: false,
        type: Sequelize.STRING
      },
      isbn: {
        allowNull: true,
        type: Sequelize.STRING
      },
      genre_ids: {
        allowNull: false,
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue: []
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
    await queryInterface.dropTable('Books');
  }
};