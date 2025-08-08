const { User } = require('../models');
const { hashPassword, comparePassword } = require('../utils/passwordHash');

const { Op } = require('sequelize');

const registerUser = async (userData) => {
  const { username, email, password, displayName } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({
    where: {
      [Op.or]: [{ username }, { email }],
    },
  });

  if (existingUser) {
    const error = new Error('User already exists');
    error.status = 409;
    throw error;
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    displayName,
    coins: 500, // Welcome bonus
  });

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user.toJSON();
  return userWithoutPassword;
};

const loginUser = async (username, password) => {
  const user = await User.findOne({
    where: { username },
  });

  if (!user) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user.toJSON();
  return userWithoutPassword;
};

module.exports = {
  registerUser,
  loginUser,
};