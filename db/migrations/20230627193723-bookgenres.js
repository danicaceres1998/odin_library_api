'use strict';

const { sequelize } = require('../../app/models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('BooksGenres', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      BookId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Books",
          key: "id",
        },
        onDelete: 'CASCADE'
      },
      GenreId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Genres",
          key: "id",
        },
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.removeColumn('Books', 'genre_ids');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('BooksGenres');
    await queryInterface.addColumn('Books', 'genre_ids', {
      allowNull: false,
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      defaultValue: []
    });
  }
};
