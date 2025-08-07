import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, X, Check, Zap } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const SAMPLE_QUESTIONS = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
    category: "Geography"
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
    category: "Science"
  },
  {
    id: 3,
    question: "Who painted the Mona Lisa?",
    options: ["Van Gogh", "Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: 2,
    category: "Art"
  },
  {
    id: 4,
    question: "What is the largest mammal in the world?",
    options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    correctAnswer: 1,
    category: "Nature"
  },
  {
    id: 5,
    question: "Which year did the first iPhone release?",
    options: ["2005", "2006", "2007", "2008"],
    correctAnswer: 2,
    category: "Technology"
  },
];

export default function SixtySecondGame() {
  const router = useRouter();
  const [gameState, setGameState] = useState('waiting'); // 'waiting' | 'playing' | 'finished'
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [questions] = useState(SAMPLE_QUESTIONS);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    let interval;

    if (gameState === 'playing' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('finished');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [gameState, timeLeft]);

  const startGame = () => {
    setGameState('playing');
    setTimeLeft(60);
    setScore(0);
    setCorrectAnswers(0);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  const selectAnswer = (answerIndex) => {
    if (selectedAnswer !== null || showFeedback) return;

    setSelectedAnswer(answerIndex);
    setShowFeedback(true);

    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setScore(prev => prev + (timeLeft > 30 ? 100 : timeLeft > 10 ? 75 : 50));
    }

    setTimeout(() => {
      nextQuestion();
    }, 1500);
  };

  const nextQuestion = () => {
    const nextIndex = (currentQuestionIndex + 1) % questions.length;
    setCurrentQuestionIndex(nextIndex);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  const quitGame = () => {
    router.back();
  };

  const playAgain = () => {
    startGame();
  };

  if (gameState === 'waiting') {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#EF4444', '#F87171']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <TouchableOpacity style={styles.closeButton} onPress={quitGame}>
            <X size={24} color="#FFF" strokeWidth={2} />
          </TouchableOpacity>

          <View style={styles.centerContent}>
            <View style={styles.gameIcon}>
              <Clock size={64} color="#FFF" strokeWidth={2} />
            </View>
            <Text style={styles.gameTitle}>60-Second Challenge</Text>
            <Text style={styles.gameDescription}>
              Answer as many questions as possible in 60 seconds!
            </Text>

            <View style={styles.rulesContainer}>
              <Text style={styles.rulesTitle}>Rules:</Text>
              <Text style={styles.ruleText}>• Answer quickly for bonus points</Text>
              <Text style={styles.ruleText}>• Correct answers increase your score</Text>
              <Text style={styles.ruleText}>• Questions get more challenging</Text>
            </View>

            <TouchableOpacity style={styles.startButton} onPress={startGame}>
              <Text style={styles.startButtonText}>Start Challenge</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (gameState === 'finished') {
    const accuracy = questions.length > 0 ? Math.round((correctAnswers / Math.max(currentQuestionIndex + 1, 1)) * 100) : 0;

    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#8B5CF6', '#A855F7']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.centerContent}>
            <View style={styles.gameIcon}>
              <Zap size={64} color="#FFF" strokeWidth={2} />
            </View>
            <Text style={styles.gameTitle}>Time's Up!</Text>

            <View style={styles.resultsContainer}>
              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>Final Score</Text>
                <Text style={styles.resultValue}>{score}</Text>
              </View>

              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>Correct Answers</Text>
                <Text style={styles.resultValue}>{correctAnswers}</Text>
              </View>

              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>Accuracy</Text>
                <Text style={styles.resultValue}>{accuracy}%</Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.playAgainButton} onPress={playAgain}>
                <Text style={styles.playAgainButtonText}>Play Again</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.homeButton} onPress={quitGame}>
                <Text style={styles.homeButtonText}>Home</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#EF4444', '#F87171']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={quitGame}>
            <X size={24} color="#FFF" strokeWidth={2} />
          </TouchableOpacity>

          <View style={styles.timerContainer}>
            <Clock size={20} color="#FFF" strokeWidth={2} />
            <Text style={styles.timerText}>{timeLeft}s</Text>
          </View>

          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>{score}</Text>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${((60 - timeLeft) / 60) * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>Question {currentQuestionIndex + 1}</Text>
        </View>

        {/* Question */}
        <View style={styles.questionContainer}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{currentQuestion.category}</Text>
          </View>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => {
            let optionStyle = styles.optionButton;
            let textStyle = styles.optionText;

            if (showFeedback && selectedAnswer !== null) {
              if (index === currentQuestion.correctAnswer) {
                optionStyle = [styles.optionButton, styles.correctOption];
                textStyle = [styles.optionText, styles.correctOptionText];
              } else if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
                optionStyle = [styles.optionButton, styles.wrongOption];
                textStyle = [styles.optionText, styles.wrongOptionText];
              }
            }

            return (
              <TouchableOpacity
                key={index}
                style={optionStyle}
                onPress={() => selectAnswer(index)}
                disabled={showFeedback}
              >
                <Text style={textStyle}>{option}</Text>
                {showFeedback && index === currentQuestion.correctAnswer && (
                  <Check size={20} color="#10B981" strokeWidth={2} />
                )}
                {showFeedback && index === selectedAnswer && index !== currentQuestion.correctAnswer && (
                  <X size={20} color="#EF4444" strokeWidth={2} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  gameIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  gameTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  gameDescription: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: '500',
  },
  rulesContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    width: '100%',
  },
  rulesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 12,
  },
  ruleText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
    fontWeight: '500',
  },
  startButton: {
    backgroundColor: '#FFF',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#EF4444',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  timerText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginLeft: 8,
  },
  scoreContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  questionContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  questionText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 32,
  },
  optionsContainer: {
    paddingHorizontal: 20,
    flex: 1,
  },
  optionButton: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  correctOption: {
    backgroundColor: '#DCFCE7',
    borderColor: '#10B981',
    borderWidth: 2,
  },
  wrongOption: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
    borderWidth: 2,
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  correctOptionText: {
    color: '#047857',
  },
  wrongOptionText: {
    color: '#DC2626',
  },
  resultsContainer: {
    width: '100%',
    marginBottom: 32,
  },
  resultCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFF',
  },
  buttonContainer: {
    width: '100%',
  },
  playAgainButton: {
    backgroundColor: '#FFF',
    paddingVertical: 16,
    borderRadius: 25,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playAgainButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8B5CF6',
    textAlign: 'center',
  },
  homeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 16,
    borderRadius: 25,
  },
  homeButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
  },
});
