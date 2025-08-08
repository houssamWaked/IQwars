const { Question, Category } = require('../models');

const questionSets = {
  flags: [
    {
      question: "Which country's flag features a red circle on a white background?",
      options: ["China", "Japan", "South Korea", "Vietnam"],
      correctAnswer: 1,
      difficulty: "easy",
      hint: "This country is known for its rising sun."
    },
    {
      question: "The flag of which country has three horizontal stripes: black, red, and gold?",
      options: ["Belgium", "Germany", "Netherlands", "Austria"],
      correctAnswer: 1,
      difficulty: "medium",
      hint: "This country is famous for Oktoberfest."
    },
    {
      question: "Which country's flag features a maple leaf?",
      options: ["United States", "Australia", "Canada", "New Zealand"],
      correctAnswer: 2,
      difficulty: "easy",
      hint: "Known for maple syrup and hockey."
    },
    // Add more flag questions...
  ],
  movies: [
    {
      question: "Who directed the movie 'The Dark Knight'?",
      options: ["Steven Spielberg", "Christopher Nolan", "Martin Scorsese", "Quentin Tarantino"],
      correctAnswer: 1,
      difficulty: "medium",
      hint: "Also directed Inception and Interstellar."
    },
    {
      question: "In which movie did Leonardo DiCaprio finally win his first Oscar?",
      options: ["Titanic", "The Wolf of Wall Street", "The Revenant", "Inception"],
      correctAnswer: 2,
      difficulty: "medium",
      hint: "He played a frontiersman surviving in the wilderness."
    },
    {
      question: "What is the highest-grossing film of all time (as of 2023)?",
      options: ["Avatar", "Avengers: Endgame", "Titanic", "Avatar: The Way of Water"],
      correctAnswer: 0,
      difficulty: "hard",
      hint: "James Cameron's science fiction epic about Pandora."
    },
    // Add more movie questions...
  ],
  tech: [
    {
      question: "What does 'HTTP' stand for?",
      options: ["HyperText Transfer Protocol", "High Tech Transfer Process", "Home Tool Transfer Protocol", "Hyperlink Text Transfer Protocol"],
      correctAnswer: 0,
      difficulty: "medium",
      hint: "It's the foundation of data communication on the World Wide Web."
    },
    {
      question: "Which company created the programming language Java?",
      options: ["Microsoft", "Apple", "Sun Microsystems", "Google"],
      correctAnswer: 2,
      difficulty: "hard",
      hint: "This company was later acquired by Oracle."
    },
    {
      question: "What does 'CPU' stand for?",
      options: ["Computer Processing Unit", "Central Processing Unit", "Core Processing Unit", "Computer Program Unit"],
      correctAnswer: 1,
      difficulty: "easy",
      hint: "It's often called the 'brain' of the computer."
    },
    // Add more tech questions...
  ],
  geography: [
    {
      question: "What is the capital of Australia?",
      options: ["Sydney", "Melbourne", "Canberra", "Perth"],
      correctAnswer: 2,
      difficulty: "medium",
      hint: "It's not the largest city, but the political center."
    },
    {
      question: "Which is the longest river in the world?",
      options: ["Amazon", "Nile", "Mississippi", "Yangtze"],
      correctAnswer: 1,
      difficulty: "medium",
      hint: "It flows through Egypt and several other African countries."
    },
    {
      question: "Mount Everest is located in which mountain range?",
      options: ["Andes", "Rocky Mountains", "Himalayas", "Alps"],
      correctAnswer: 2,
      difficulty: "easy",
      hint: "This mountain range stretches across several Asian countries."
    },
    // Add more geography questions...
  ],
  general: [
    {
      question: "How many bones are there in an adult human body?",
      options: ["206", "208", "210", "212"],
      correctAnswer: 0,
      difficulty: "medium",
      hint: "It's an even number between 200 and 210."
    },
    {
      question: "What is the chemical symbol for gold?",
      options: ["Go", "Gd", "Au", "Ag"],
      correctAnswer: 2,
      difficulty: "hard",
      hint: "From the Latin word 'aurum'."
    },
    {
      question: "Which planet is closest to the Sun?",
      options: ["Venus", "Mars", "Mercury", "Earth"],
      correctAnswer: 2,
      difficulty: "easy",
      hint: "Named after the Roman messenger god."
    },
    // Add more general knowledge questions...
  ],
  science: [
    {
      question: "What is the hardest natural substance on Earth?",
      options: ["Gold", "Iron", "Diamond", "Platinum"],
      correctAnswer: 2,
      difficulty: "easy",
      hint: "It's often used in engagement rings."
    },
    {
      question: "What gas makes up about 78% of Earth's atmosphere?",
      options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
      correctAnswer: 2,
      difficulty: "medium",
      hint: "It's essential for plant growth but we can't breathe it alone."
    },
    {
      question: "How many chambers does a human heart have?",
      options: ["2", "3", "4", "5"],
      correctAnswer: 2,
      difficulty: "easy",
      hint: "Two atria and two ventricles."
    },
    // Add more science questions...
  ],
  history: [
    {
      question: "In which year did World War II end?",
      options: ["1944", "1945", "1946", "1947"],
      correctAnswer: 1,
      difficulty: "easy",
      hint: "The same year the atomic bombs were dropped on Japan."
    },
    {
      question: "Who was the first person to walk on the moon?",
      options: ["Buzz Aldrin", "Neil Armstrong", "John Glenn", "Alan Shepard"],
      correctAnswer: 1,
      difficulty: "easy",
      hint: "He said 'That's one small step for man, one giant leap for mankind.'"
    },
    {
      question: "The ancient city of Rome was built on how many hills?",
      options: ["5", "6", "7", "8"],
      correctAnswer: 2,
      difficulty: "medium",
      hint: "It's a lucky number in many cultures."
    },
    // Add more history questions...
  ],
  sports: [
    {
      question: "How often are the Summer Olympic Games held?",
      options: ["Every 2 years", "Every 3 years", "Every 4 years", "Every 5 years"],
      correctAnswer: 2,
      difficulty: "easy",
      hint: "Same interval as a U.S. presidential election cycle."
    },
    {
      question: "In which sport would you perform a slam dunk?",
      options: ["Tennis", "Basketball", "Volleyball", "Baseball"],
      correctAnswer: 1,
      difficulty: "easy",
      hint: "Michael Jordan was famous for this move."
    },
    {
      question: "What is the maximum score possible in ten-pin bowling?",
      options: ["200", "250", "300", "350"],
      correctAnswer: 2,
      difficulty: "medium",
      hint: "It's achieved by getting 12 strikes in a row."
    },
    // Add more sports questions...
  ],
};

async function seedQuestions() {
  try {
    console.log('❓ Seeding questions...');
    
    // Get all categories
    const categories = await Category.findAll();
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.slug] = cat.id;
    });

    let totalQuestions = 0;

    for (const [categorySlug, questions] of Object.entries(questionSets)) {
      if (!categoryMap[categorySlug]) {
        console.warn(`⚠️  Category '${categorySlug}' not found, skipping questions`);
        continue;
      }

      for (const questionData of questions) {
        await Question.findOrCreate({
          where: {
            question: questionData.question,
            categoryId: categoryMap[categorySlug],
          },
          defaults: {
            ...questionData,
            categoryId: categoryMap[categorySlug],
          },
        });
        totalQuestions++;
      }

      console.log(`✅ Seeded ${questions.length} questions for ${categorySlug}`);
    }

    console.log(`✅ Total questions seeded: ${totalQuestions}`);
  } catch (error) {
    console.error('❌ Error seeding questions:', error);
    throw error;
  }
}

module.exports = seedQuestions;