import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { LogIn, UserPlus } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Welcome to QuizTime!</Text>
          <Text style={styles.headerSubtitle}>Log in or sign up to start your knowledge journey.</Text>
        </View>

        {/* Login Option */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push('/login')}
          >
            <LinearGradient
              colors={['#3B82F6', '#60A5FA']}
              style={styles.iconBackground}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <LogIn size={28} color="#FFF" strokeWidth={2} />
            </LinearGradient>
            <View style={styles.content}>
              <Text style={styles.cardTitle}>Log In</Text>
              <Text style={styles.cardDescription}>Access your profile and continue playing</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Sign Up Option */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push('/signup')}
          >
            <LinearGradient
              colors={['#10B981', '#34D399']}
              style={styles.iconBackground}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <UserPlus size={28} color="#FFF" strokeWidth={2} />
            </LinearGradient>
            <View style={styles.content}>
              <Text style={styles.cardTitle}>Sign Up</Text>
              <Text style={styles.cardDescription}>Create a new account and unlock achievements</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Guest Option */}
        <View style={styles.guestContainer}>
          <Text style={styles.guestText}>Or</Text>
          <TouchableOpacity onPress={() => router.push('/play')}>
            <Text style={styles.guestLink}>Continue as Guest</Text>
          </TouchableOpacity>
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
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
    maxWidth: 300,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFF',
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
  iconBackground: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  guestContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  guestText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 8,
  },
  guestLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
    textDecorationLine: 'underline',
  },
});