import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Brain, X, Check, CircleHelp as HelpCircle, Eye, SkipForward } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const SAMPLE_QUESTIONS = [
  {
    id: 1,
    question: "What is the capital of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Perth"],
    correctAnswer: 2,
    hint: "It's not the largest city, but the political center.",
    difficulty: 'easy'
  },
  {
    id: 2,
    question: "Who wrote the novel '1984'?",
    options: ["Aldous Huxley", "George Orwell", "Ray Bradbury", "Kurt Vonnegut"],
    correctAnswer: 1,
    hint: "He also wrote 'Animal Farm'.",
    difficulty: 'medium'
  },
  {
    id: 3,
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctAnswer: 2,
    hint: "From the Latin word 'aurum'.",
    difficulty: 'hard'
  },
];

export default function ClassicGame() {
  const router = useRouter();
  const [gameState, setGameState] = useState('waiting');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [questions] = useState(SAMPLE_QUESTIONS);
  const [showHint, setShowHint] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState([]);
  const [lifelines, setLifelines] = useState([
    { id: 'fifty', name: '50/50', icon: Eye, used: false, description: 'Remove two wrong answers' },
    { id: 'hint', name: 'Hint', icon: HelpCircle, used: false, description: 'Get a helpful hint' },
    { id: 'skip', name: 'Skip', icon: SkipForward, used: false, description: 'Skip this question' },
  ]);

  const currentQuestion = questions[currentQuestionIndex];

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setCorrectAnswers(0);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setShowHint(false);
    setEliminatedOptions([]);
    setLifelines(lifelines.map(l => ({ ...l, used: false })));
  };

  const selectAnswer = (answerIndex) => {
    if (selectedAnswer !== null || showFeedback) return;

    setSelectedAnswer(answerIndex);
    setShowFeedback(true);

    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      const difficultyMultiplier = currentQuestion.difficulty === 'easy' ? 100 : 
                                   currentQuestion.difficulty === 'medium' ? 150 : 200;
      setScore(prev => prev + difficultyMultiplier);
    }

    setTimeout(() => {
      if (currentQuestionIndex + 1 >= questions.length) {
        setGameState('finished');
      } else {
        nextQuestion();
      }
    }, 2000);
  };

  const nextQuestion = () => {
    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setShowHint(false);
    setEliminatedOptions([]);
  };

  const useLifeline = (lifelineId) => {
    const lifeline = lifelines.find(l => l.id === lifelineId);
    if (!lifeline || lifeline.used) return;

    setLifelines(prev => prev.map(l => 
      l.id === lifelineId ? { ...l, used: true } : l
    ));

    switch (lifelineId) {
      case 'fifty':
        const wrongAnswers = currentQuestion.options
          .map((_, index) => index)
          .filter(index => index !== currentQuestion.correctAnswer);
        const toEliminate = wrongAnswers.slice(0, 2);
        setEliminatedOptions(toEliminate);
        break;
      case 'hint':
        setShowHint(true);
        break;
      case 'skip':
        if (currentQuestionIndex + 1 >= questions.length) {
          setGameState('finished');
        } else {
          nextQuestion();
        }
        break;
    }
  };

  const quitGame = () => {
    router.back();
  };

  const playAgain = () => {
    startGame();
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'hard': return '#EF4444';
      default: return '#6B7280';
    }
  };


  if (gameState === 'waiting') {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#3B82F6', '#60A5FA']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <TouchableOpacity style={styles.closeButton} onPress={quitGame}>
            <X size={24} color="#FFF" strokeWidth={2} />
          </TouchableOpacity>

          <View style={styles.centerContent}>
            <View style={styles.gameIcon}>
              <Brain size={64} color="#FFF" strokeWidth={2} />
            </View>
            <Text style={styles.gameTitle}>Classic Quiz</Text>
            <Text style={styles.gameDescription}>
              Answer questions with the help of lifelines
            </Text>
            
            <View style={styles.lifelinesPreview}>
              <Text style={styles.lifelinesTitle}>Available Lifelines:</Text>
              {lifelines.map((lifeline) => (
                <View key={lifeline.id} style={styles.lifelinePreviewItem}>
                  <lifeline.icon size={20} color="#FFF" strokeWidth={2} />
                  <Text style={styles.lifelinePreviewText}>
                    {lifeline.name}: {lifeline.description}
                  </Text>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.startButton} onPress={startGame}>
              <Text style={styles.startButtonText}>Start Quiz</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (gameState === 'finished') {
    const accuracy = Math.round((correctAnswers / questions.length) * 100);
    
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
              <Brain size={64} color="#FFF" strokeWidth={2} />
            </View>
            <Text style={styles.gameTitle}>Quiz Complete!</Text>
            
            <View style={styles.resultsContainer}>
              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>Final Score</Text>
                <Text style={styles.resultValue}>{score}</Text>
              </View>
              
              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>Correct Answers</Text>
                <Text style={styles.resultValue}>{correctAnswers}/{questions.length}</Text>
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
        colors={['#3B82F6', '#60A5FA']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={quitGame}>
            <X size={24} color="#FFF" strokeWidth={2} />
          </TouchableOpacity>
          
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {currentQuestionIndex + 1} / {questions.length}
            </Text>
          </View>
          
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>{score}</Text>
          </View>
        </View>

        {/* Lifelines */}
        <View style={styles.lifelinesContainer}>
          {lifelines.map((lifeline) => (
            <TouchableOpacity
              key={lifeline.id}
              style={[styles.lifelineButton, lifeline.used && styles.usedLifeline]}
              onPress={() => useLifeline(lifeline.id)}
              disabled={lifeline.used || showFeedback}
            >
              <lifeline.icon 
                size={20} 
                color={lifeline.used ? "#9CA3AF" : "#FFF"} 
                strokeWidth={2} 
              />
              <Text style={[styles.lifelineText, lifeline.used && styles.usedLifelineText]}>
                {lifeline.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Question */}
        <View style={styles.questionContainer}>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(currentQuestion.difficulty) }]}>
            <Text style={styles.difficultyText}>{currentQuestion.difficulty.toUpperCase()}</Text>
          </View>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
          {showHint && (
            <View style={styles.hintContainer}>
              <HelpCircle size={16} color="#F59E0B" strokeWidth={2} />
              <Text style={styles.hintText}>{currentQuestion.hint}</Text>
            </View>
          )}
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => {
            let optionStyle = styles.optionButton;
            let textStyle = styles.optionText;
            
            if (eliminatedOptions.includes(index)) {
              optionStyle = [styles.optionButton, styles.eliminatedOption];
              textStyle = [styles.optionText, styles.eliminatedOptionText];
            }
            
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
                disabled={showFeedback || eliminatedOptions.includes(index)}
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
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
  lifelinesPreview: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    width: '100%',
  },
  lifelinesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 12,
  },
  lifelinePreviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  lifelinePreviewText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginLeft: 8,
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
    color: '#3B82F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  progressContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  scoreContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  lifelinesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  lifelineButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 10,
    borderRadius: 20,
  },
  usedLifeline: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    opacity: 0.5,
  },
  lifelineText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
    marginLeft: 4,
  },
  usedLifelineText: {
    color: '#9CA3AF',
  },
  questionContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
    alignItems: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFF',
  },
  questionText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 16,
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderColor: '#F59E0B',
    borderWidth: 1,
  },
  hintText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
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
  eliminatedOption: {
    backgroundColor: '#F3F4F6',
    opacity: 0.5,
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
  eliminatedOptionText: {
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
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