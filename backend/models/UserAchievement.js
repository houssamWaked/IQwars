const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserAchievement = sequelize.define('UserAchievement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  achievementKey: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  unlockedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'user_achievements',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'achievementKey'],
    },
  ],
});

module.exports = UserAchievement;