const sequelize = require('../config/database'); // no destructuring

const seedCategories = require('./categories');
const seedQuestions = require('./questions');

async function runSeeders() {
  try {
    console.log('🌱 Starting database seeding...');

    // Ensure database is connected
    await sequelize.authenticate();
    console.log('✅ Database connection established.');

    // Sync models
    await sequelize.sync({ force: false });
    console.log('✅ Database models synchronized.');

    // Run seeders
    await seedCategories();
    await seedQuestions();

    console.log('✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

runSeeders();
