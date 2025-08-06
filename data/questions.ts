import { Question } from '@/types/question';

export const SAMPLE_QUESTIONS: Question[] = [
  // Geography - World Flags
  {
    id: 1,
    question: "Which country's flag features a red circle on a white background?",
    options: ["China", "Japan", "South Korea", "Vietnam"],
    correctAnswer: 1,
    category: "Geography",
    difficulty: "easy",
    hint: "This country is known for its cherry blossoms and sushi.",
    explanation: "Japan's flag, called the Hinomaru, features a red circle representing the sun."
  },
  {
    id: 2,
    question: "What color is the star on the flag of Turkey?",
    options: ["Yellow", "White", "Red", "Blue"],
    correctAnswer: 1,
    category: "Geography",
    difficulty: "easy",
    hint: "It's the same color as the crescent moon on the flag.",
    explanation: "The Turkish flag features a white star and crescent moon on a red background."
  },

  // Movies & TV
  {
    id: 3,
    question: "Who directed the movie 'Inception'?",
    options: ["Steven Spielberg", "Christopher Nolan", "Martin Scorsese", "Quentin Tarantino"],
    correctAnswer: 1,
    category: "Movies",
    difficulty: "medium",
    hint: "He also directed The Dark Knight trilogy.",
    explanation: "Christopher Nolan is known for his complex, mind-bending films."
  },
  {
    id: 4,
    question: "Which movie won the Academy Award for Best Picture in 2020?",
    options: ["1917", "Joker", "Parasite", "Once Upon a Time in Hollywood"],
    correctAnswer: 2,
    category: "Movies",
    difficulty: "medium",
    hint: "It was the first non-English film to win Best Picture.",
    explanation: "Parasite made history as the first non-English language film to win Best Picture."
  },

  // Technology
  {
    id: 5,
    question: "What does 'AI' stand for in technology?",
    options: ["Automated Intelligence", "Artificial Intelligence", "Advanced Integration", "Adaptive Interface"],
    correctAnswer: 1,
    category: "Technology",
    difficulty: "easy",
    hint: "It refers to machines that can think like humans.",
    explanation: "Artificial Intelligence (AI) refers to the simulation of human intelligence in machines."
  },
  {
    id: 6,
    question: "Which company developed the programming language Java?",
    options: ["Microsoft", "Sun Microsystems", "IBM", "Google"],
    correctAnswer: 1,
    category: "Technology",
    difficulty: "hard",
    hint: "This company was later acquired by Oracle.",
    explanation: "Sun Microsystems developed Java in the mid-1990s."
  },

  // General Knowledge
  {
    id: 7,
    question: "What is the largest planet in our solar system?",
    options: ["Saturn", "Jupiter", "Neptune", "Earth"],
    correctAnswer: 1,
    category: "Science",
    difficulty: "easy",
    hint: "It's known for its Great Red Spot.",
    explanation: "Jupiter is the largest planet and is famous for its massive storm system."
  },
  {
    id: 8,
    question: "Which element has the chemical symbol 'O'?",
    options: ["Osmium", "Oxygen", "Olivine", "Ozone"],
    correctAnswer: 1,
    category: "Science",
    difficulty: "easy",
    hint: "We breathe this gas to survive.",
    explanation: "Oxygen is essential for life and makes up about 21% of Earth's atmosphere."
  },

  // History
  {
    id: 9,
    question: "In which year did World War II end?",
    options: ["1944", "1945", "1946", "1947"],
    correctAnswer: 1,
    category: "History",
    difficulty: "medium",
    hint: "It ended in the same year the atomic bombs were dropped on Japan.",
    explanation: "World War II ended in 1945 after Japan surrendered following the atomic bombings."
  },
  {
    id: 10,
    question: "Who was the first person to walk on the moon?",
    options: ["Buzz Aldrin", "Neil Armstrong", "John Glenn", "Yuri Gagarin"],
    correctAnswer: 1,
    category: "History",
    difficulty: "medium",
    hint: "He said 'That's one small step for man, one giant leap for mankind.'",
    explanation: "Neil Armstrong was the first human to set foot on the lunar surface on July 20, 1969."
  },

  // Sports
  {
    id: 11,
    question: "How many players are on a basketball team on the court at one time?",
    options: ["4", "5", "6", "7"],
    correctAnswer: 1,
    category: "Sports",
    difficulty: "easy",
    hint: "It's the same number of fingers on one hand.",
    explanation: "Each basketball team has 5 players on the court at any given time."
  },
  {
    id: 12,
    question: "Which country has won the most FIFA World Cups?",
    options: ["Germany", "Argentina", "Brazil", "Italy"],
    correctAnswer: 2,
    category: "Sports",
    difficulty: "medium",
    hint: "This South American country is famous for soccer and carnival.",
    explanation: "Brazil has won the FIFA World Cup 5 times, more than any other nation."
  },

  // Art & Literature
  {
    id: 13,
    question: "Who painted 'The Starry Night'?",
    options: ["Pablo Picasso", "Vincent van Gogh", "Claude Monet", "Leonardo da Vinci"],
    correctAnswer: 1,
    category: "Art",
    difficulty: "medium",
    hint: "This Dutch artist cut off his own ear.",
    explanation: "Vincent van Gogh painted this masterpiece in 1889 while in an asylum."
  },
  {
    id: 14,
    question: "Who wrote the novel 'Pride and Prejudice'?",
    options: ["Charlotte Brontë", "Jane Austen", "Emily Dickinson", "Virginia Woolf"],
    correctAnswer: 1,
    category: "Literature",
    difficulty: "medium",
    hint: "She wrote many novels about English society in the early 19th century.",
    explanation: "Jane Austen published Pride and Prejudice in 1813."
  },

  // Music
  {
    id: 15,
    question: "How many strings does a standard guitar have?",
    options: ["5", "6", "7", "8"],
    correctAnswer: 1,
    category: "Music",
    difficulty: "easy",
    hint: "It's one more than the number of fingers on one hand.",
    explanation: "A standard acoustic or electric guitar has 6 strings."
  }
];

export const getQuestionsByCategory = (category: string): Question[] => {
  return SAMPLE_QUESTIONS.filter(q => q.category.toLowerCase() === category.toLowerCase());
};

export const getQuestionsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): Question[] => {
  return SAMPLE_QUESTIONS.filter(q => q.difficulty === difficulty);
};

export const getRandomQuestions = (count: number): Question[] => {
  const shuffled = [...SAMPLE_QUESTIONS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};