import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, Brain, Star, Zap, Trophy, Coins } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const stats = {
    level: 12,
    xp: 2450,
    xpToNext: 3000,
    coins: 1250,
    streak: 5,
  };

  const dailyChallenges = [
    { id: 1, title: 'Speed Demon', desc: 'Answer 20 questions in 60 seconds', progress: 12, total: 20, reward: 100 },
    { id: 2, title: 'Perfect Score', desc: 'Get 100% in Classic Mode', progress: 0, total: 1, reward: 250 },
    { id: 3, title: 'Category Master', desc: 'Complete 3 different categories', progress: 1, total: 3, reward: 150 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.nameText}>Genius Player</Text>
          </View>
          <View style={styles.coinsContainer}>
            <Coins size={20} color="#F59E0B" strokeWidth={2} />
            <Text style={styles.coinsText}>{stats.coins}</Text>
          </View>
        </View>

        {/* Level Progress */}
        <LinearGradient
          colors={['#8B5CF6', '#A855F7']}
          style={styles.levelCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.levelHeader}>
            <Text style={styles.levelText}>Level {stats.level}</Text>
            <View style={styles.streakContainer}>
              <Zap size={16} color="#FFF" strokeWidth={2} />
              <Text style={styles.streakText}>{stats.streak} day streak</Text>
            </View>
          </View>
          <View style={styles.xpContainer}>
            <View style={styles.xpBar}>
              <View style={[styles.xpFill, { width: `${(stats.xp / stats.xpToNext) * 100}%` }]} />
            </View>
            <Text style={styles.xpText}>{stats.xp} / {stats.xpToNext} XP</Text>
          </View>
        </LinearGradient>

        {/* Quick Play Modes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Play</Text>
          <View style={styles.gameModeGrid}>
            <TouchableOpacity 
              style={styles.gameModeCard}
              onPress={() => router.push('/game/sixty-second')}
            >
              <LinearGradient
                colors={['#EF4444', '#F87171']}
                style={styles.gameModeGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Clock size={32} color="#FFF" strokeWidth={2} />
              </LinearGradient>
              <Text style={styles.gameModeTitle}>60-Second</Text>
              <Text style={styles.gameModeDesc}>Fast & Furious</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.gameModeCard}
              onPress={() => router.push('/game/classic')}
            >
              <LinearGradient
                colors={['#3B82F6', '#60A5FA']}
                style={styles.gameModeGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Brain size={32} color="#FFF" strokeWidth={2} />
              </LinearGradient>
              <Text style={styles.gameModeTitle}>Classic Quiz</Text>
              <Text style={styles.gameModeDesc}>Think It Through</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.gameModeCard}
              onPress={() => router.push('/game/story')}
            >
              <LinearGradient
                colors={['#10B981', '#34D399']}
                style={styles.gameModeGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Star size={32} color="#FFF" strokeWidth={2} />
              </LinearGradient>
              <Text style={styles.gameModeTitle}>Story Mode</Text>
              <Text style={styles.gameModeDesc}>Progressive Journey</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Daily Challenges */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Daily Challenges</Text>
            <Trophy size={20} color="#F59E0B" strokeWidth={2} />
          </View>
          {dailyChallenges.map((challenge) => (
            <View key={challenge.id} style={styles.challengeCard}>
              <View style={styles.challengeContent}>
                <Text style={styles.challengeTitle}>{challenge.title}</Text>
                <Text style={styles.challengeDesc}>{challenge.desc}</Text>
                <View style={styles.challengeProgress}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${(challenge.progress / challenge.total) * 100}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{challenge.progress}/{challenge.total}</Text>
                </View>
              </View>
              <View style={styles.challengeReward}>
                <Coins size={16} color="#F59E0B" strokeWidth={2} />
                <Text style={styles.rewardText}>{challenge.reward}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  welcomeText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  nameText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 2,
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  coinsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginLeft: 4,
  },
  levelCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
    marginLeft: 4,
  },
  xpContainer: {
    marginTop: 8,
  },
  xpBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 4,
  },
  xpText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFF',
    textAlign: 'center',
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  gameModeGrid: {
    paddingHorizontal: 20,
  },
  gameModeCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  gameModeGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  gameModeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  gameModeDesc: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  challengeCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  challengeContent: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  challengeDesc: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  challengeProgress: {
    flexDirection: 'row',
    alignItems: 'center',
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
    backgroundColor: '#8B5CF6',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  challengeReward: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rewardText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
    marginLeft: 2,
  },
});