const calculateXP = (gameMode, score, correctAnswers, difficulty) => {
  const baseXP = 10;
  const modeMultiplier = {
    'sixty-second': 1.5,
    'classic': 2.0,
    'story': 1.8,
    'multiplayer': 2.5,
  };
  
  const difficultyMultiplier = {
    'easy': 1.0,
    'medium': 1.5,
    'hard': 2.0,
  };

  return Math.floor(
    baseXP * 
    correctAnswers * 
    (modeMultiplier[gameMode] || 1) * 
    (difficultyMultiplier[difficulty] || 1)
  );
};

const calculateCoins = (score, correctAnswers) => {
  return Math.floor(score / 100) + (correctAnswers * 5);
};

const calculateLevel = (totalXP) => {
  // Each level requires progressively more XP
  return Math.floor(Math.sqrt(totalXP / 1000)) + 1;
};

const getXPForNextLevel = (currentLevel) => {
  return Math.pow(currentLevel, 2) * 1000;
};

const checkAchievements = (user, gameData) => {
  const achievements = [];
  
  // First Win
  if (user.totalGames === 1) {
    achievements.push('first_win');
  }
  
  // Speed Demon - 50+ correct in 60-second mode
  if (gameData.gameMode === 'sixty-second' && gameData.correctAnswers >= 50) {
    achievements.push('speed_demon');
  }
  
  // Perfectionist - 100% accuracy
  if (gameData.totalQuestions > 0 && gameData.correctAnswers === gameData.totalQuestions) {
    achievements.push('perfectionist');
  }
  
  // Streak Master - 10+ day streak
  if (user.currentStreak >= 10) {
    achievements.push('streak_master');
  }
  
  return achievements;
};

module.exports = {
  calculateXP,
  calculateCoins,
  calculateLevel,
  getXPForNextLevel,
  checkAchievements,
};