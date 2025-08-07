const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  constructor(userData) {
    this.id = userData.id;
    this.username = userData.username;
    this.email = userData.email;
    this.level = userData.level;
    this.xp = userData.xp;
    this.coins = userData.coins;
    this.current_streak = userData.current_streak;
    this.best_streak = userData.best_streak;
    this.total_games = userData.total_games;
    this.correct_answers = userData.correct_answers;
    this.created_at = userData.created_at;
    this.last_login = userData.last_login;
    this.last_played = userData.last_played;
  }

  // Find user by ID
  static async findById(id) {
    try {
      const result = await pool.query(
        'SELECT id, username, email, level, xp, coins, current_streak, best_streak, total_games, correct_answers, created_at, last_login, last_played FROM users WHERE id = $1',
        [id]
      );
      
      return result.rows.length > 0 ? new User(result.rows[0]) : null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email.toLowerCase()]
      );
      
      return result.rows.length > 0 ? new User(result.rows[0]) : null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  // Check if username or email exists
  static async existsByEmailOrUsername(email, username) {
    try {
      const result = await pool.query(
        'SELECT id FROM users WHERE email = $1 OR username = $2',
        [email.toLowerCase(), username.toLowerCase()]
      );
      
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error checking user existence:', error);
      throw error;
    }
  }

  // Create new user
  static async create(userData) {
    try {
      const { username, email, password } = userData;
      
      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const result = await pool.query(`
        INSERT INTO users (username, email, password_hash) 
        VALUES ($1, $2, $3) 
        RETURNING id, username, email, level, xp, coins, current_streak, created_at
      `, [username, email.toLowerCase(), passwordHash]);

      return new User(result.rows[0]);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Verify password
  async verifyPassword(password) {
    try {
      const result = await pool.query('SELECT password_hash FROM users WHERE id = $1', [this.id]);
      if (result.rows.length === 0) return false;
      
      return await bcrypt.compare(password, result.rows[0].password_hash);
    } catch (error) {
      console.error('Error verifying password:', error);
      throw error;
    }
  }

  // Update last login
  async updateLastLogin() {
    try {
      await pool.query(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
        [this.id]
      );
      this.last_login = new Date();
    } catch (error) {
      console.error('Error updating last login:', error);
      throw error;
    }
  }

  // Update user stats after game
  async updateStats(correctAnswers, xpGained, coinsGained) {
    try {
      const result = await pool.query(`
        UPDATE users 
        SET total_games = total_games + 1,
            correct_answers = correct_answers + $1,
            xp = xp + $2,
            coins = coins + $3,
            last_played = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING level, xp, coins, total_games, correct_answers
      `, [correctAnswers, xpGained, coinsGained, this.id]);

      const updated = result.rows[0];
      this.level = updated.level;
      this.xp = updated.xp;
      this.coins = updated.coins;
      this.total_games = updated.total_games;
      this.correct_answers = updated.correct_answers;
      this.last_played = new Date();

      return updated;
    } catch (error) {
      console.error('Error updating user stats:', error);
      throw error;
    }
  }

  // Update level
  async updateLevel(newLevel) {
    try {
      await pool.query('UPDATE users SET level = $1 WHERE id = $2', [newLevel, this.id]);
      this.level = newLevel;
    } catch (error) {
      console.error('Error updating user level:', error);
      throw error;
    }
  }

  // Update streak
  async updateStreak() {
    try {
      await pool.query(
        'UPDATE users SET current_streak = current_streak + 1, best_streak = GREATEST(best_streak, current_streak + 1) WHERE id = $1',
        [this.id]
      );
      this.current_streak += 1;
      this.best_streak = Math.max(this.best_streak, this.current_streak);
    } catch (error) {
      console.error('Error updating streak:', error);
      throw error;
    }
  }

  // Get user profile with statistics
  async getProfile() {
    try {
      const result = await pool.query(`
        SELECT 
          u.*,
          CASE 
            WHEN u.total_games > 0 THEN ROUND((u.correct_answers::float / (u.total_games * 10)) * 100, 1)
            ELSE 0 
          END as accuracy,
          COALESCE(recent_games.avg_score, 0) as recent_avg_score,
          COALESCE(recent_games.games_this_week, 0) as games_this_week
        FROM users u
        LEFT JOIN (
          SELECT 
            user_id,
            AVG(score) as avg_score,
            COUNT(*) as games_this_week
          FROM game_sessions 
          WHERE created_at >= CURRENT_DATE - INTERVAL '7 days' 
            AND status = 'completed'
          GROUP BY user_id
        ) recent_games ON u.id = recent_games.user_id
        WHERE u.id = $1
      `, [this.id]);

      return result.rows[0];
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  // Update username
  async updateUsername(newUsername) {
    try {
      await pool.query('UPDATE users SET username = $1 WHERE id = $2', [newUsername, this.id]);
      this.username = newUsername;
    } catch (error) {
      console.error('Error updating username:', error);
      throw error;
    }
  }

  // Public user data (without sensitive info)
  toPublic() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      level: this.level,
      xp: this.xp,
      coins: this.coins,
      streak: this.current_streak,
      bestStreak: this.best_streak,
      totalGames: this.total_games,
      correctAnswers: this.correct_answers,
      joinedAt: this.created_at,
      lastPlayed: this.last_played
    };
  }
}

module.exports = User;
