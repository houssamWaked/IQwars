import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Star, Lock, Trophy, ChevronRight, X, Flag, Film, Cpu } from 'lucide-react-native';
import { useRouter } from 'expo-router';

type Level = {
  id: number;
  name: string;
  category: string;
  icon: any;
  color: string;
  unlocked: boolean;
  completed: boolean;
  progress: number;
  totalQuestions: number;
  xpReward: number;
  coinReward: number;
};

const STORY_LEVELS: Level[] = [
  {
    id: 1,
    name: "Flags of Europe",
    category: "Geography",
    icon: Flag,
    color: '#EF4444',
    unlocked: true,
    completed: true,
    progress: 10,
    totalQuestions: 10,
    xpReward: 100,
    coinReward: 50,
  },
  {
    id: 2,
    name: "World Capitals",
    category: "Geography",
    icon: Flag,
    color: '#EF4444',
    unlocked: true,
    completed: false,
    progress: 5,
    totalQuestions: 15,
    xpReward: 150,
    coinReward: 75,
  },
  {
    id: 3,
    name: "Classic Movies",
    category: "Entertainment",
    icon: Film,
    color: '#F59E0B',
    unlocked: true,
    completed: false,
    progress: 0,
    totalQuestions: 12,
    xpReward: 120,
    coinReward: 60,
  },
  {
    id: 4,
    name: "Tech Giants",
    category: "Technology",
    icon: Cpu,
    color: '#3B82F6',
    unlocked: false,
    completed: false,
    progress: 0,
    totalQuestions: 20,
    xpReward: 200,
    coinReward: 100,
  },
  {
    id: 5,
    name: "Ancient History",
    category: "History",
    icon: Trophy,
    color: '#8B5CF6',
    unlocked: false,
    completed: false,
    progress: 0,
    totalQuestions: 25,
    xpReward: 250,
    coinReward: 125,
  },
];

export default function StoryMode() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);

  const playerStats = {
    totalXP: 2450,
    totalCoins: 1250,
    levelsCompleted: 1,
    totalLevels: STORY_LEVELS.length,
  };

  const startLevel = (level: Level) => {
    if (!level.unlocked) return;
    // Here you would navigate to the actual level gameplay
    // For now, we'll just show the level details
    setSelectedLevel(level);
  };

  const closeModal = () => {
    setSelectedLevel(null);
  };

  const goBack = () => {
    router.back();
  };

  const renderLevelCard = (level: Level, index: number) => {
    const isLocked = !level.unlocked;
    const progressPercentage = level.totalQuestions > 0 ? (level.progress / level.totalQuestions) * 100 : 0;

    return (
      <TouchableOpacity
        key={level.id}
        style={[styles.levelCard, isLocked && styles.lockedLevelCard]}
        onPress={() => startLevel(level)}
        disabled={isLocked}
      >
        <View style={[styles.levelIcon, { backgroundColor: level.color }, isLocked && styles.lockedIcon]}>
          {isLocked ? (
            <Lock size={24} color="#9CA3AF" strokeWidth={2} />
          ) : (
            <level.icon size={24} color="#FFF" strokeWidth={2} />
          )}
        </View>
        
        <View style={styles.levelContent}>
          <View style={styles.levelHeader}>
            <Text style={[styles.levelName, isLocked && styles.lockedText]}>
              {level.name}
            </Text>
            {level.completed && (
              <View style={styles.completedBadge}>
                <Star size={16} color="#F59E0B" strokeWidth={2} />
              </View>
            )}
          </View>
          
          <Text style={[styles.levelCategory, isLocked && styles.lockedText]}>
            {level.category}
          </Text>
          
          {!isLocked && (
            <>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
                </View>
                <Text style={styles.progressText}>
                  {level.progress}/{level.totalQuestions}
                </Text>
              </View>
              
              <View style={styles.rewardContainer}>
                <View style={styles.rewardItem}>
                  <Text style={styles.rewardText}>{level.xpReward} XP</Text>
                </View>
                <View style={styles.rewardItem}>
                  <Text style={styles.rewardText}>{level.coinReward} coins</Text>
                </View>
              </View>
            </>
          )}
        </View>
        
        <ChevronRight size={20} color={isLocked ? "#9CA3AF" : "#6B7280"} strokeWidth={2} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#10B981', '#34D399']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <X size={24} color="#FFF" strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Story Mode</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Progress Overview */}
        <View style={styles.overviewCard}>
          <Text style={styles.overviewTitle}>Your Journey</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{playerStats.levelsCompleted}/{playerStats.totalLevels}</Text>
              <Text style={styles.statLabel}>Levels Complete</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{playerStats.totalXP}</Text>
              <Text style={styles.statLabel}>Total XP</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{playerStats.totalCoins}</Text>
              <Text style={styles.statLabel}>Coins Earned</Text>
            </View>
          </View>
        </View>

        {/* Levels List */}
        <ScrollView style={styles.levelsList} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Levels</Text>
          {STORY_LEVELS.map((level, index) => renderLevelCard(level, index))}
        </ScrollView>
      </LinearGradient>

      {/* Level Detail Modal */}
      {selectedLevel && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <X size={24} color="#6B7280" strokeWidth={2} />
            </TouchableOpacity>
            
            <View style={[styles.modalIcon, { backgroundColor: selectedLevel.color }]}>
              <selectedLevel.icon size={32} color="#FFF" strokeWidth={2} />
            </View>
            
            <Text style={styles.modalTitle}>{selectedLevel.name}</Text>
            <Text style={styles.modalCategory}>{selectedLevel.category}</Text>
            
            <View style={styles.modalStats}>
              <View style={styles.modalStatItem}>
                <Text style={styles.modalStatValue}>{selectedLevel.totalQuestions}</Text>
                <Text style={styles.modalStatLabel}>Questions</Text>
              </View>
              <View style={styles.modalStatItem}>
                <Text style={styles.modalStatValue}>{selectedLevel.xpReward}</Text>
                <Text style={styles.modalStatLabel}>XP Reward</Text>
              </View>
              <View style={styles.modalStatItem}>
                <Text style={styles.modalStatValue}>{selectedLevel.coinReward}</Text>
                <Text style={styles.modalStatLabel}>Coins</Text>
              </View>
            </View>
            
            {selectedLevel.progress > 0 && (
              <View style={styles.modalProgress}>
                <Text style={styles.modalProgressLabel}>Progress</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${(selectedLevel.progress / selectedLevel.totalQuestions) * 100}%` }]} />
                </View>
                <Text style={styles.progressText}>
                  {selectedLevel.progress}/{selectedLevel.totalQuestions} completed
                </Text>
              </View>
            )}
            
            <TouchableOpacity style={styles.startLevelButton}>
              <Text style={styles.startLevelButtonText}>
                {selectedLevel.progress > 0 ? 'Continue Level' : 'Start Level'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },
  placeholder: {
    width: 40,
  },
  overviewCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  levelsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 16,
  },
  levelCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lockedLevelCard: {
    opacity: 0.6,
  },
  levelIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  lockedIcon: {
    backgroundColor: '#E5E7EB',
  },
  levelContent: {
    flex: 1,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  levelName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  completedBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 4,
  },
  levelCategory: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    fontWeight: '500',
  },
  lockedText: {
    color: '#9CA3AF',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  rewardContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  rewardItem: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rewardText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalCategory: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
    fontWeight: '500',
  },
  modalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 24,
  },
  modalStatItem: {
    alignItems: 'center',
  },
  modalStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  modalStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  modalProgress: {
    width: '100%',
    marginBottom: 24,
  },
  modalProgressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  startLevelButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  startLevelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
});