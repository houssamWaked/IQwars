const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GameQuestion = sequelize.define('GameQuestion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  gameId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'games',
      key: 'id',
    },
  },
  questionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'questions',
      key: 'id',
    },
  },
  userAnswer: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 3,
    },
  },
  isCorrect: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  timeToAnswer: {
    type: DataTypes.INTEGER, // in seconds
    allowNull: true,
  },
  questionOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  answeredAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'game_questions',
  timestamps: true,
});

module.exports = GameQuestion;