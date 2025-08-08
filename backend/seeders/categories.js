const { Category } = require('../models');

const categories = [
  {
    name: 'World Flags',
    slug: 'flags',
    icon: 'Flag',
    color: '#EF4444',
    description: 'Test your knowledge of flags from around the world',
  },
  {
    name: 'Movies & TV',
    slug: 'movies',
    icon: 'Film',
    color: '#F59E0B',
    description: 'Questions about popular movies and TV shows',
  },
  {
    name: 'Technology',
    slug: 'tech',
    icon: 'Cpu',
    color: '#3B82F6',
    description: 'Tech industry, programming, and digital innovation',
  },
  {
    name: 'Geography',
    slug: 'geography',
    icon: 'Globe',
    color: '#10B981',
    description: 'Countries, capitals, landmarks, and world geography',
  },
  {
    name: 'General Knowledge',
    slug: 'general',
    icon: 'Book',
    color: '#8B5CF6',
    description: 'A mix of questions from various topics',
  },
  {
    name: 'Science',
    slug: 'science',
    icon: 'Microscope',
    color: '#06B6D4',
    description: 'Physics, chemistry, biology, and scientific discoveries',
  },
  {
    name: 'History',
    slug: 'history',
    icon: 'Scroll',
    color: '#DC2626',
    description: 'Historical events, figures, and civilizations',
  },
  {
    name: 'Sports',
    slug: 'sports',
    icon: 'Trophy',
    color: '#059669',
    description: 'Sports trivia, athletes, and competitions',
  },
];

async function seedCategories() {
  try {
    console.log('📂 Seeding categories...');
    
    for (const categoryData of categories) {
      await Category.findOrCreate({
        where: { slug: categoryData.slug },
        defaults: categoryData,
      });
    }
    
    console.log(`✅ Seeded ${categories.length} categories`);
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    throw error;
  }
}

module.exports = seedCategories;