const Joi = require('joi');

const validateRegistration = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateGameComplete = (req, res, next) => {
  const schema = Joi.object({
    game_mode: Joi.string().valid('60-second', 'classic', 'story').required(),
    score: Joi.number().integer().min(0).required(),
    correct_answers: Joi.number().integer().min(0).required(),
    total_questions: Joi.number().integer().min(1).required(),
    time_taken: Joi.number().integer().min(0).required(),
    questions_answered: Joi.array().items(
      Joi.object({
        question_id: Joi.number().integer().required(),
        selected_answer: Joi.number().integer().min(0).max(3).required(),
        time_spent: Joi.number().integer().min(0).required()
      })
    ).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateGameComplete
};