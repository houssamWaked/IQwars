import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Medal, Award, Crown, Zap } from 'lucide-react-native';

export default function LeaderboardScreen() {
  const [activeTab, setActiveTab] = useState('weekly');

  const weeklyLeaders = [
    { rank: 1, name: 'QuizMaster99', score: 15420, level: 25, streak: 12 },
    { rank: 2, name: 'BrainBox', score: 14850, level: 23, streak: 8 },
    { rank: 3, name: 'TriviaKing', score: 14200, level: 22, streak: 15 },
    { rank: 4, name: 'SmartCookie', score: 13900, level: 21, streak: 6 },
    { rank: 5, name: 'KnowItAll', score: 13500, level: 20, streak: 9 },
    { rank: 6, name: 'QuickWit', score: 13200, level: 19, streak: 4 },
    { rank: 7, name: 'Genius47', score: 12800, level: 18, streak: 7 },
    { rank: 8, name: 'MindBender', score: 12500, level: 17, streak: 3 },
    { rank: 9, name: 'FactFinder', score: 12100, level: 16, streak: 11 },
    { rank: 10, name: 'WisdomSeeker', score: 11900, level: 15, streak: 5 },
  ];

  const allTimeLeaders = [
    { rank: 1, name: 'LegendaryMind', score: 89420, level: 47, streak: 25 },
    { rank: 2, name: 'MegaBrain', score: 85230, level: 45, streak: 18 },
    { rank: 3, name: 'UltimateGenius', score: 82100, level: 43, streak: 22 },
    { rank: 4, name: 'QuizEmperor', score: 78900, level: 41, streak: 14 },
    { rank: 5, name: 'BrainSurgeon', score: 75600, level: 39, streak: 19 },
    { rank: 6, name: 'MindMaster', score: 72300, level: 37, streak: 16 },
    { rank: 7, name: 'ThoughtLeader', score: 69800, level: 35, streak: 13 },
    { rank: 8, name: 'WisdomKeeper', score: 67200, level: 33, streak: 20 },
    { rank: 9, name: 'KnowledgeBank', score: 64500, level: 31, streak: 10 },
    { rank: 10, name: 'FactMachine', score: 61800, level: 29, streak: 8 },
  ];

  const currentData = activeTab === 'weekly' ? weeklyLeaders : allTimeLeaders;
  const userRank = { rank: 47, name: 'You', score: 8520, level: 12, streak: 5 };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown size={24} color="#F59E0B" strokeWidth={2} />;
      case 2:
        return <Trophy size={24} color="#6B7280" strokeWidth={2} />;
      case 3:
        return <Medal size={24} color="#CD7C2F" strokeWidth={2} />;
      default:
        return <Award size={20} color="#9CA3AF" strokeWidth={2} />;
    }
  };

  const getRankColors = (rank) => {
    switch (rank) {
      case 1:
        return ['#F59E0B', '#F97316'];
      case 2:
        return ['#6B7280', '#9CA3AF'];
      case 3:
        return ['#CD7C2F', '#D97706'];
      default:
        return ['#E5E7EB', '#F3F4F6'];
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <Text style={styles.headerSubtitle}>See how you rank among other players</Text>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'weekly' && styles.activeTab]}
          onPress={() => setActiveTab('weekly')}
        >
          <Text style={[styles.tabText, activeTab === 'weekly' && styles.activeTabText]}>
            This Week
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'allTime' && styles.activeTab]}
          onPress={() => setActiveTab('allTime')}
        >
          <Text style={[styles.tabText, activeTab === 'allTime' && styles.activeTabText]}>
            All Time
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Top 3 Podium */}
        <View style={styles.podiumContainer}>
          {currentData.slice(0, 3).map((player, index) => (
            <View
              key={player.rank}
              style={[
                styles.podiumCard,
                { zIndex: index === 0 ? 3 : index === 1 ? 2 : 1 },
              ]}
            >
              <LinearGradient
                colors={getRankColors(player.rank)}
                style={[styles.podiumGradient, index === 0 && styles.firstPlace]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {getRankIcon(player.rank)}
                <Text style={[styles.podiumName, player.rank > 3 && { color: '#6B7280' }]}>
                  {player.name}
                </Text>
                <Text style={[styles.podiumScore, player.rank > 3 && { color: '#6B7280' }]}>
                  {player.score.toLocaleString()}
                </Text>
                <View style={styles.podiumLevel}>
                  <Text style={[styles.podiumLevelText, player.rank > 3 && { color: '#6B7280' }]}>
                    Lv.{player.level}
                  </Text>
                </View>
              </LinearGradient>
            </View>
          ))}
        </View>

        {/* Rest of the leaderboard */}
        <View style={styles.leaderboardList}>
          {currentData.slice(3).map((player) => (
            <View key={player.rank} style={styles.leaderboardItem}>
              <View style={styles.rankContainer}>
                <Text style={styles.rankNumber}>{player.rank}</Text>
              </View>
              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{player.name}</Text>
                <View style={styles.playerStats}>
                  <Text style={styles.playerLevel}>Level {player.level}</Text>
                  <View style={styles.streakContainer}>
                    <Zap size={12} color="#F59E0B" strokeWidth={2} />
                    <Text style={styles.streakText}>{player.streak}</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.playerScore}>{player.score.toLocaleString()}</Text>
            </View>
          ))}
        </View>

        {/* Your Rank */}
        <View style={styles.yourRankContainer}>
          <Text style={styles.yourRankTitle}>Your Rank</Text>
          <LinearGradient
            colors={['#8B5CF6', '#A855F7']}
            style={styles.yourRankCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.yourRankContent}>
              <View style={styles.yourRankLeft}>
                <Text style={styles.yourRankNumber}>#{userRank.rank}</Text>
                <View>
                  <Text style={styles.yourRankName}>{userRank.name}</Text>
                  <Text style={styles.yourRankLevel}>Level {userRank.level}</Text>
                </View>
              </View>
              <View style={styles.yourRankRight}>
                <Text style={styles.yourRankScore}>{userRank.score.toLocaleString()}</Text>
                <View style={styles.yourStreakContainer}>
                  <Zap size={14} color="#FFF" strokeWidth={2} />
                  <Text style={styles.yourStreakText}>{userRank.streak} streak</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 32,
    height: 180,
    alignItems: 'flex-end',
  },
  podiumCard: {
    flex: 1,
    marginHorizontal: 4,
  },
  podiumGradient: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    height: 140,
    justifyContent: 'center',
  },
  firstPlace: {
    height: 160,
    marginTop: -20,
  },
  podiumName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
    marginTop: 8,
    textAlign: 'center',
  },
  podiumScore: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginTop: 4,
  },
  podiumLevel: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 8,
  },
  podiumLevelText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFF',
  },
  leaderboardList: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  leaderboardItem: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  rankContainer: {
    width: 32,
    alignItems: 'center',
    marginRight: 12,
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6B7280',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  playerStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerLevel: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 12,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F59E0B',
    marginLeft: 2,
  },
  playerScore: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  yourRankContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  yourRankTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  yourRankCard: {
    borderRadius: 16,
    padding: 20,
  },
  yourRankContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  yourRankLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yourRankNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginRight: 16,
  },
  yourRankName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  yourRankLevel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  yourRankRight: {
    alignItems: 'flex-end',
  },
  yourRankScore: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },
  yourStreakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  yourStreakText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
    marginLeft: 4,
  },
});
