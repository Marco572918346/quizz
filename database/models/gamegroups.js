'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GameGroups extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.GameGroups.hasMany(models.UserGameGroups,
        {
        as: 'GameGroupsPlayer',
        foreignKey:'groupId'
        }
      ),
      models.GameGroups.belongsToMany(models.Cards, {
        through: models.GameGroupCards,
        as: 'selectedCardsData', // Cambia el nombre de la asociación de ser necesario
        foreignKey: 'groupId'
      });
    }
  }
  GameGroups.init({
    groupName: DataTypes.STRING,
    key: DataTypes.INTEGER,
    maxPlayers: DataTypes.INTEGER,
    currentPlayers: {
      type: DataTypes.INTEGER,
      validate: {
        async isWithinMaxPlayers(value) {
          if (value > this.maxPlayers) {
            throw new ValidationError('Cannot have more players than maxPlayers');
          }
        }
      }
    },
    selectedCards: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [] // Valor inicial del arreglo vacío
    }
  }, {
    sequelize,
    modelName: 'GameGroups',
  });
  return GameGroups;
};