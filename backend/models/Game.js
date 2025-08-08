const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Game = sequelize.define('Game', {
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
  gameMode: {
    type: DataTypes.ENUM('sixty-second', 'classic', 'story', 'multiplayer'),
    allowNull: false,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id',
    },
  },
  score: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  correctAnswers: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  totalQuestions: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  timeSpent: {
    type: DataTypes.INTEGER, // in seconds
    defaultValue: 0,
  },
  xpEarned: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  coinsEarned: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('in_progress', 'completed', 'abandoned'),
    defaultValue: 'in_progress',
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'games',
  timestamps: true,
});

module.exports = Game;