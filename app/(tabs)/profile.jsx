import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  User, 
  Settings, 
  Trophy, 
  Clock, 
  Brain, 
  Star, 
  Coins, 
  Zap, 
  Target, 
  Award,
  ChevronRight
} from 'lucide-react-native';

export default function ProfileScreen() {
  const userStats = {
    name: 'Genius Player',
    level: 12,
    xp: 2450,
    xpToNext: 3000,
    coins: 1250,
    streak: 5,
    totalGames: 127,
    correctAnswers: 892,
    accuracy: 78,
    bestStreak: 15,
  };

  const achievements = [
    { id: 1, title: 'First Win', desc: 'Win your first game', unlocked: true },
    { id: 2, title: 'Speed Demon', desc: 'Answer 50 questions in 60 seconds', unlocked: true },
    { id: 3, title: 'Perfectionist', desc: 'Get 100% accuracy in a game', unlocked: true },
    { id: 4, title: 'Streak Master', desc: 'Maintain a 10-day streak', unlocked: false },
    { id: 5, title: 'Category Expert', desc: 'Complete all levels in a category', unlocked: false },
    { id: 6, title: 'Quiz Legend', desc: 'Reach level 25', unlocked: false },
  ];

  const gameStats = [
    { label: 'Total Games', value: userStats.totalGames, icon: Target },
    { label: 'Correct Answers', value: userStats.correctAnswers, icon: Brain },
    { label: 'Accuracy Rate', value: `${userStats.accuracy}%`, icon: Trophy },
    { label: 'Best Streak', value: userStats.bestStreak, icon: Zap },
  ];

  const menuItems = [
    { title: 'Game Statistics', icon: Trophy, action: 'stats' },
    { title: 'Settings', icon: Settings, action: 'settings' },
    { title: 'Help & Support', icon: User, action: 'help' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <LinearGradient
          colors={['#8B5CF6', '#A855F7']}
          style={styles.profileHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <User size={48} color="#8B5CF6" strokeWidth={2} />
            </View>
          </View>
          <Text style={styles.userName}>{userStats.name}</Text>
          <View style={styles.levelContainer}>
            <Text style={styles.levelText}>Level {userStats.level}</Text>
            <View style={styles.streakBadge}>
              <Zap size={14} color="#FFF" strokeWidth={2} />
              <Text style={styles.streakText}>{userStats.streak} day streak</Text>
            </View>
          </View>
          
          {/* XP Progress */}
          <View style={styles.xpContainer}>
            <View style={styles.xpBar}>
              <View style={[styles.xpFill, { width: `${(userStats.xp / userStats.xpToNext) * 100}%` }]} />
            </View>
            <Text style={styles.xpText}>{userStats.xp} / {userStats.xpToNext} XP</Text>
          </View>
        </LinearGradient>

        {/* Coins Display */}
        <View style={styles.coinsCard}>
          <View style={styles.coinsContent}>
            <Coins size={24} color="#F59E0B" strokeWidth={2} />
            <Text style={styles.coinsAmount}>{userStats.coins}</Text>
            <Text style={styles.coinsLabel}>Coins</Text>
          </View>
          <TouchableOpacity style={styles.shopButton}>
            <Text style={styles.shopButtonText}>Shop</Text>
          </TouchableOpacity>
        </View>

        {/* Game Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Game Statistics</Text>
          <View style={styles.statsGrid}>
            {gameStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={styles.statIcon}>
                  <stat.icon size={20} color="#8B5CF6" strokeWidth={2} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsGrid}>
            {achievements.map((achievement) => (
              <View 
                key={achievement.id} 
                style={[styles.achievementCard, !achievement.unlocked && styles.lockedAchievement]}
              >
                <View style={[styles.achievementIcon, !achievement.unlocked && styles.lockedIcon]}>
                  <Award size={20} color={achievement.unlocked ? "#F59E0B" : "#9CA3AF"} strokeWidth={2} />
                </View>
                <Text style={[styles.achievementTitle, !achievement.unlocked && styles.lockedText]}>
                  {achievement.title}
                </Text>
                <Text style={[styles.achievementDesc, !achievement.unlocked && styles.lockedText]}>
                  {achievement.desc}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuItemIcon}>
                  <item.icon size={20} color="#6B7280" strokeWidth={2} />
                </View>
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" strokeWidth={2} />
            </TouchableOpacity>
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
  profileHeader: {
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginRight: 12,
  },
  streakBadge: {
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
    width: '100%',
    alignItems: 'center',
  },
  xpBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
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
  },
  coinsCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  coinsContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinsAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 12,
    marginRight: 8,
  },
  coinsLabel: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  shopButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  shopButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  achievementCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  lockedAchievement: {
    opacity: 0.6,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  lockedIcon: {
    backgroundColor: '#F3F4F6',
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
  },
  achievementDesc: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  lockedText: {
    color: '#9CA3AF',
  },
  menuItem: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
});