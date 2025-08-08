const { Question, Category } = require('../models');
const { Op } = require('sequelize');

const getCategories = async () => {
  const categories = await Category.findAll({
    where: { isActive: true },
    attributes: ['id', 'name', 'slug', 'icon', 'color', 'description'],
    include: [
      {
        model: Question,
        as: 'questions',
        where: { isActive: true },
        attributes: [],
        required: false,
      },
    ],
    group: ['Category.id'],
    order: [['name', 'ASC']],
  });

  return categories.map(category => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    icon: category.icon,
    color: category.color,
    description: category.description,
    questionCount: category.questions?.length || 0,
  }));
};

const getQuestionsByCategory = async (categoryId, limit = 20, difficulty = null) => {
  const whereClause = {
    categoryId: parseInt(categoryId),
    isActive: true,
  };

  if (difficulty) {
    whereClause.difficulty = difficulty;
  }

  const questions = await Question.findAll({
    where: whereClause,
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['name', 'slug'],
      },
    ],
    order: sequelize.random(),
    limit,
  });

  return questions.map(question => ({
    id: question.id,
    question: question.question,
    options: question.options,
    difficulty: question.difficulty,
    hint: question.hint,
    category: question.category,
  }));
};

const getRandomQuestions = async (limit = 20, difficulty = null) => {
  const whereClause = {
    isActive: true,
  };

  if (difficulty) {
    whereClause.difficulty = difficulty;
  }

  const questions = await Question.findAll({
    where: whereClause,
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['name', 'slug'],
      },
    ],
    order: sequelize.random(),
    limit,
  });

  return questions.map(question => ({
    id: question.id,
    question: question.question,
    options: question.options,
    difficulty: question.difficulty,
    hint: question.hint,
    category: question.category,
  }));
};

module.exports = {
  getCategories,
  getQuestionsByCategory,
  getRandomQuestions,
};