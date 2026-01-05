import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus, TrendingUp, Clock, Calendar, Target } from 'lucide-react-native';
import { useTraining } from '@/hooks/training-context';
import { StatCard } from '@/components/StatCard';
import { SessionCard } from '@/components/SessionCard';

export default function DashboardScreen() {
  const router = useRouter();
  const { getTodaySessions, getStats, sessions } = useTraining();
  const todaySessions = getTodaySessions();
  const weekStats = getStats('week');
  const allTimeStats = getStats('all');

  const recentSessions = [...sessions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Image 
              source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/60y7t7kc77i4jkhmluv8r' }} 
              style={styles.logo}
              resizeMode="contain"
            />
            <View style={styles.headerText}>
              <Text style={styles.greeting}>Welcome Back!</Text>
              <Text style={styles.subtitle}>
                {todaySessions.length > 0 
                  ? `${todaySessions.length} session${todaySessions.length > 1 ? 's' : ''} today`
                  : "Let's roll."}
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push({ pathname: '/add-session' } as any)}
          >
            <Plus size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            title="This Week"
            value={weekStats.totalHours.toFixed(1)}
            subtitle="hours"
            icon={Clock}
            color="#07a7f7"
          />
          <StatCard
            title="Sessions"
            value={weekStats.sessionsCount}
            subtitle="this week"
            icon={Calendar}
            color="#666"
          />
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            title="Current Streak"
            value={weekStats.currentStreak}
            subtitle="days"
            icon={TrendingUp}
            color="#888"
          />
          <StatCard
            title="Total Hours"
            value={allTimeStats.totalHours.toFixed(0)}
            subtitle="all time"
            icon={Target}
            color="#aaa"
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Training</Text>
            <TouchableOpacity onPress={() => router.push({ pathname: '/log' } as any)}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          {recentSessions.length > 0 ? (
            recentSessions.map(session => (
              <SessionCard
                key={session.id}
                session={session}
                onEdit={() => router.push({ pathname: '/edit-session', params: { id: session.id } } as any)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No training sessions yet</Text>
              <TouchableOpacity 
                style={styles.emptyButton}
                onPress={() => router.push({ pathname: '/add-session' } as any)}
              >
                <Text style={styles.emptyButtonText}>Log your first session</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#07a7f7',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  seeAll: {
    color: '#07a7f7',
    fontSize: 14,
  },
  emptyState: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    marginBottom: 16,
  },
  emptyButton: {
    backgroundColor: '#07a7f7',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});