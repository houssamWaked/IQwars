const pool = require('../config/database');

const initDatabase = async () => {
  try {
    console.log('🔄 Initializing database...');

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        level INTEGER DEFAULT 1,
        xp INTEGER DEFAULT 0,
        coins INTEGER DEFAULT 0,
        current_streak INTEGER DEFAULT 0,
        best_streak INTEGER DEFAULT 0,
        total_games INTEGER DEFAULT 0,
        correct_answers INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP,
        last_played TIMESTAMP
      )
    `);

    // Create categories table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        icon VARCHAR(50),
        color VARCHAR(7),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create questions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        category_id INTEGER REFERENCES categories(id),
        question TEXT NOT NULL,
        option_a VARCHAR(255) NOT NULL,
        option_b VARCHAR(255) NOT NULL,
        option_c VARCHAR(255) NOT NULL,
        option_d VARCHAR(255) NOT NULL,
        correct_answer INTEGER NOT NULL CHECK (correct_answer >= 0 AND correct_answer <= 3),
        difficulty VARCHAR(10) CHECK (difficulty IN ('easy', 'medium', 'hard')),
        hint TEXT,
        explanation TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create game sessions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS game_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        game_mode VARCHAR(20) NOT NULL,
        category_id INTEGER REFERENCES categories(id),
        score INTEGER DEFAULT 0,
        correct_answers INTEGER DEFAULT 0,
        total_questions INTEGER DEFAULT 0,
        time_taken INTEGER,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create game answers table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS game_answers (
        id SERIAL PRIMARY KEY,
        game_session_id INTEGER REFERENCES game_sessions(id),
        question_id INTEGER REFERENCES questions(id),
        selected_answer INTEGER,
        time_spent INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create achievements table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS achievements (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description TEXT,
        condition_type VARCHAR(50),
        condition_value INTEGER,
        xp_reward INTEGER DEFAULT 0,
        coin_reward INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create user achievements table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_achievements (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        achievement_id INTEGER REFERENCES achievements(id),
        unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, achievement_id)
      )
    `);

    // Insert sample categories
    await pool.query(`
      INSERT INTO categories (name, icon, color) VALUES 
      ('Geography', 'Flag', '#EF4444'),
      ('Movies & TV', 'Film', '#F59E0B'),
      ('Technology', 'Cpu', '#3B82F6'),
      ('Science', 'Beaker', '#10B981'),
      ('Sports', 'Trophy', '#8B5CF6'),
      ('History', 'Clock', '#EC4899'),
      ('Art & Literature', 'Palette', '#F97316'),
      ('Music', 'Music', '#84CC16')
      ON CONFLICT (name) DO NOTHING
    `);

    // Insert sample questions
    const sampleQuestions = [
      // Geography
      [1, 'What is the capital of France?', 'London', 'Berlin', 'Paris', 'Madrid', 2, 'easy', 'City of Light', 'Paris is the capital and most populous city of France.'],
      [1, 'Which country has the most time zones?', 'USA', 'Russia', 'China', 'Canada', 1, 'medium', 'Largest country by land area', 'Russia spans 11 time zones.'],
      [1, 'What is the smallest country in the world?', 'Monaco', 'Vatican City', 'San Marino', 'Liechtenstein', 1, 'easy', 'Located in Rome', 'Vatican City is only 0.17 square miles.'],
      
      // Movies & TV
      [2, 'Who directed the movie "Inception"?', 'Steven Spielberg', 'Christopher Nolan', 'Martin Scorsese', 'Quentin Tarantino', 1, 'medium', 'Also directed The Dark Knight', 'Christopher Nolan is known for complex, mind-bending films.'],
      [2, 'Which movie won Best Picture at the 2020 Oscars?', '1917', 'Joker', 'Parasite', 'Once Upon a Time in Hollywood', 2, 'medium', 'First non-English film to win', 'Parasite made Oscar history.'],
      [2, 'Who played Tony Stark in the Marvel movies?', 'Chris Evans', 'Robert Downey Jr.', 'Chris Hemsworth', 'Mark Ruffalo', 1, 'easy', 'Started the MCU', 'RDJ played Iron Man from 2008-2019.'],
      
      // Technology  
      [3, 'What does "AI" stand for?', 'Automated Intelligence', 'Artificial Intelligence', 'Advanced Integration', 'Adaptive Interface', 1, 'easy', 'Machines that think', 'AI simulates human intelligence in machines.'],
      [3, 'Who founded Microsoft?', 'Steve Jobs', 'Bill Gates', 'Mark Zuckerberg', 'Larry Page', 1, 'medium', 'Co-founded with Paul Allen', 'Bill Gates co-founded Microsoft in 1975.'],
      [3, 'What does "URL" stand for?', 'Universal Resource Locator', 'Uniform Resource Locator', 'United Resource Link', 'Universal Reference Link', 1, 'medium', 'Web addresses', 'URLs specify the location of web resources.'],
      
      // Science
      [4, 'What is the chemical symbol for gold?', 'Go', 'Au', 'Gd', 'Ag', 1, 'medium', 'From Latin "aurum"', 'Gold''s symbol comes from its Latin name.'],
      [4, 'What is the largest planet in our solar system?', 'Saturn', 'Jupiter', 'Neptune', 'Earth', 1, 'easy', 'Known for Great Red Spot', 'Jupiter is more than twice as massive as all other planets combined.'],
      [4, 'What gas do plants absorb from the atmosphere?', 'Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen', 1, 'easy', 'Used in photosynthesis', 'Plants use CO2 to make food and release oxygen.'],
      
      -- Sports
      [5, 'How many players are on a basketball team on court?', '4', '5', '6', '7', 1, 'easy', 'Same as fingers on one hand', 'Each team has 5 players on court at once.'],
      [5, 'Which country has won the most FIFA World Cups?', 'Germany', 'Argentina', 'Brazil', 'Italy', 2, 'medium', 'South American soccer powerhouse', 'Brazil has won 5 World Cups.'],
      [5, 'In which sport would you perform a slam dunk?', 'Football', 'Basketball', 'Tennis', 'Baseball', 1, 'easy', 'Involves jumping and a hoop', 'Slam dunks are iconic basketball moves.']
    ];

    for (const [category_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty, hint, explanation] of sampleQuestions) {
      await pool.query(`
        INSERT INTO questions (category_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty, hint, explanation)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT DO NOTHING
      `, [category_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty, hint, explanation]);
    }

    // Insert sample achievements
    await pool.query(`
      INSERT INTO achievements (title, description, condition_type, condition_value, xp_reward, coin_reward) VALUES 
      ('First Win', 'Complete your first game', 'games_played', 1, 50, 25),
      ('Speed Demon', 'Answer 20 questions correctly in 60-Second mode', 'sixty_second_correct', 20, 100, 50),
      ('Perfect Game', 'Get 100% accuracy in any game mode', 'perfect_accuracy', 100, 150, 75),
      ('Streak Master', 'Maintain a 7-day playing streak', 'daily_streak', 7, 200, 100),
      ('Quiz Expert', 'Reach level 10', 'level_reached', 10, 300, 150),
      ('Category Master', 'Play games in all categories', 'categories_played', 8, 250, 125)
      ON CONFLICT (title) DO NOTHING
    `);

    console.log('✅ Database initialized successfully!');
    console.log('📊 Sample data inserted');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  } finally {
    await pool.end();
  }
};

// Run if called directly
if (require.main === module) {
  initDatabase();
}

module.exports = initDatabase;
