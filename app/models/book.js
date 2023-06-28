'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Author, { foreignKey: 'author_id' });
      this.hasMany(models.BookInstance, { foreignKey: 'book_id', onDelete: 'cascade' });
      this.belongsToMany(models.Genre, { through: 'BooksGenres', onDelete: 'cascade' })
    }
  }
  Book.init({
    title: DataTypes.STRING,
    author_id: DataTypes.INTEGER,
    summary: DataTypes.STRING,
    isbn: DataTypes.STRING,
    url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Book'
  });

  return Book;
};
