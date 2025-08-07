import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, Brain, Star, Users, Flag, Film, Cpu, Globe, Book } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function PlayScreen() {
  const router = useRouter();

  const categories = [
    { id: 'flags', name: 'World Flags', icon: Flag, color: '#EF4444', questions: 120 },
    { id: 'movies', name: 'Movies & TV', icon: Film, color: '#F59E0B', questions: 200 },
    { id: 'tech', name: 'Technology', icon: Cpu, color: '#3B82F6', questions: 150 },
    { id: 'geography', name: 'Geography', icon: Globe, color: '#10B981', questions: 180 },
    { id: 'general', name: 'General Knowledge', icon: Book, color: '#8B5CF6', questions: 300 },
  ];

  const gameModes = [
    {
      id: '60-second',
      title: '60-Second Challenge',
      description: 'Answer as many questions as possible in 60 seconds',
      icon: Clock,
      colors: ['#EF4444', '#F87171'],
      route: '/game/sixty-second',
    },
    {
      id: 'classic',
      title: 'Classic Quiz',
      description: 'Traditional quiz with lifelines and increasing difficulty',
      icon: Brain,
      colors: ['#3B82F6', '#60A5FA'],
      route: '/game/classic',
    },
    {
      id: 'story',
      title: 'Story Mode',
      description: 'Progress through levels and unlock new content',
      icon: Star,
      colors: ['#10B981', '#34D399'],
      route: '/game/story',
    },
    {
      id: 'multiplayer',
      title: 'Multiplayer Battle',
      description: 'Challenge friends or random opponents',
      icon: Users,
      colors: ['#8B5CF6', '#A855F7'],
      route: '/game/multiplayer',
      comingSoon: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Choose Your Challenge</Text>
          <Text style={styles.headerSubtitle}>Test your knowledge across different modes and categories</Text>
        </View>

        {/* Game Modes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Game Modes</Text>
          {gameModes.map((mode) => (
            <TouchableOpacity
              key={mode.id}
              style={[styles.gameModeCard, mode.comingSoon && styles.comingSoonCard]}
              onPress={() => !mode.comingSoon && router.push(mode.route)}
              activeOpacity={mode.comingSoon ? 1 : 0.7}
            >
              <LinearGradient
                colors={mode.colors}
                style={styles.gameModeIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <mode.icon size={28} color="#FFF" strokeWidth={2} />
              </LinearGradient>
              <View style={styles.gameModeContent}>
                <View style={styles.gameModeHeader}>
                  <Text style={styles.gameModeTitle}>{mode.title}</Text>
                  {mode.comingSoon && (
                    <View style={styles.comingSoonBadge}>
                      <Text style={styles.comingSoonText}>Coming Soon</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.gameModeDescription, mode.comingSoon && styles.comingSoonText]}>
                  {mode.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => router.push(`/game/category/${category.id}`)}
              >
                <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                  <category.icon size={24} color="#FFF" strokeWidth={2} />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryQuestions}>{category.questions} questions</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Daily Challenge */}
        <View style={styles.section}>
          <LinearGradient
            colors={['#F59E0B', '#F97316']}
            style={styles.dailyChallengeCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.dailyChallengeContent}>
              <Text style={styles.dailyChallengeTitle}>Daily Challenge</Text>
              <Text style={styles.dailyChallengeDesc}>
                Complete today's special quiz for bonus rewards!
              </Text>
              <TouchableOpacity style={styles.dailyChallengeButton}>
                <Text style={styles.dailyChallengeButtonText}>Start Challenge</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.dailyChallengeIcon}>
              <Star size={48} color="rgba(255, 255, 255, 0.8)" strokeWidth={1} />
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  gameModeCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  comingSoonCard: {
    opacity: 0.6,
  },
  gameModeIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  gameModeContent: {
    flex: 1,
  },
  gameModeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  gameModeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  comingSoonBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  comingSoonText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#92400E',
  },
  gameModeDescription: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  categoriesGrid: {
    paddingHorizontal: 20,
  },
  categoryCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  categoryQuestions: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  dailyChallengeCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  dailyChallengeContent: {
    flex: 1,
  },
  dailyChallengeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  dailyChallengeDesc: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    marginBottom: 16,
  },
  dailyChallengeButton: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  dailyChallengeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
  },
  dailyChallengeIcon: {
    marginLeft: 16,
  },
});