'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BookInstance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Book, { foreignKey: 'book_id' });
    }

    static statuses() {
      return ['available', 'sold_out', 'coming_soon'];
    }
  }
  BookInstance.init({
    book_id: DataTypes.INTEGER,
    imprint: DataTypes.BOOLEAN,
    status: DataTypes.ENUM(BookInstance.statuses()),
    url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'BookInstance'
  });
  return BookInstance;
};