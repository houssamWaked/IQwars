const sequelize = require('../config/database');
const User = require('./User');
const Question = require('./Question');
const Category = require('./Category');
const Game = require('./Game');
const GameQuestion = require('./GameQuestion');
const UserAchievement = require('./UserAchievement');

// Define associations
User.hasMany(Game, { foreignKey: 'userId', as: 'games' });
Game.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Category.hasMany(Question, { foreignKey: 'categoryId', as: 'questions' });
Question.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

Game.hasMany(GameQuestion, { foreignKey: 'gameId', as: 'gameQuestions' });
GameQuestion.belongsTo(Game, { foreignKey: 'gameId', as: 'game' });

Question.hasMany(GameQuestion, { foreignKey: 'questionId', as: 'gameQuestions' });
GameQuestion.belongsTo(Question, { foreignKey: 'questionId', as: 'question' });

User.hasMany(UserAchievement, { foreignKey: 'userId', as: 'achievements' });
UserAchievement.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  User,
  Question,
  Category,
  Game,
  GameQuestion,
  UserAchievement,
};
