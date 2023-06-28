'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Author extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Book, { foreignKey: 'author_id', onDelete: 'cascade' });
    }
  }
  Author.init({
    first_name: DataTypes.STRING,
    family_name: DataTypes.STRING,
    date_of_birth: DataTypes.DATE,
    date_of_death: DataTypes.DATE,
    name: DataTypes.STRING,
    lifespan: DataTypes.STRING,
    url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Author'
  });
  return Author;
};