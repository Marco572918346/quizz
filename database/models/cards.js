'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cards extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Cards.belongsToMany(models.GameGroups, {
        through: models.GameGroupCards, // Agrega esta línea para especificar el modelo intermedio
        as: 'selectedCards',
        foreignKey: 'cardId'
      });
    }
  }
  Cards.init({
    cardName: DataTypes.STRING,
    typeCard: DataTypes.STRING,
    image_path: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Cards',
  });
  return Cards;
};