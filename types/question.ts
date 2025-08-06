export type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  hint?: string;
  explanation?: string;
};

export type GameMode = '60-second' | 'classic' | 'story' | 'multiplayer';

export type GameState = 'waiting' | 'playing' | 'paused' | 'finished';

export type UserStats = {
  level: number;
  xp: number;
  xpToNext: number;
  coins: number;
  streak: number;
  totalGames: number;
  correctAnswers: number;
  accuracy: number;
  bestStreak: number;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  progress?: number;
  target?: number;
  xpReward: number;
  coinReward: number;
};