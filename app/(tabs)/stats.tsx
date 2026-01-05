import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, Award, Clock, Calendar, Target, Zap } from 'lucide-react-native';
import { useTraining } from '@/hooks/training-context';
import { StatCard } from '@/components/StatCard';

type Period = 'week' | 'month' | 'year' | 'all';

export default function StatsScreen() {
  const { getStats, sessions } = useTraining();
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('month');
  
  const stats = getStats(selectedPeriod);

  const getTrainingByType = () => {
    const filtered = selectedPeriod === 'all' ? sessions : sessions.filter(s => {
      const sessionDate = new Date(s.date);
      const now = new Date();
      
      if (selectedPeriod === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return sessionDate >= weekAgo;
      } else if (selectedPeriod === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return sessionDate >= monthAgo;
      } else if (selectedPeriod === 'year') {
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        return sessionDate >= yearAgo;
      }
      return true;
    });

    const typeCount: Record<string, number> = {};
    filtered.forEach(s => {
      typeCount[s.type] = (typeCount[s.type] || 0) + 1;
    });

    return Object.entries(typeCount)
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({ type, count }));
  };

  const trainingByType = getTrainingByType();

  const periods: { value: Period; label: string }[] = [
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' },
    { value: 'all', label: 'All Time' },
  ];

  const typeLabels: Record<string, string> = {
    'gi': 'Gi Training',
    'no-gi': 'No-Gi Training',
    'open-mat': 'Open Mat',
    'competition': 'Competition',
    'drilling': 'Drilling',
    'private': 'Private Lesson',
  };

  const typeColors: Record<string, string> = {
    'gi': '#07a7f7',
    'no-gi': '#8B4513',
    'open-mat': '#32CD32',
    'competition': '#DC2626',
    'drilling': '#9333EA',
    'private': '#F59E0B',
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.periodSelector}>
          {periods.map(period => (
            <TouchableOpacity
              key={period.value}
              style={[
                styles.periodButton,
                selectedPeriod === period.value && styles.periodButtonActive
              ]}
              onPress={() => setSelectedPeriod(period.value)}
            >
              <Text style={[
                styles.periodText,
                selectedPeriod === period.value && styles.periodTextActive
              ]}>
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            title="Total Hours"
            value={stats.totalHours.toFixed(1)}
            subtitle="hours trained"
            icon={Clock}
            color="#07a7f7"
          />
          <StatCard
            title="Sessions"
            value={stats.sessionsCount}
            subtitle="completed"
            icon={Calendar}
            color="#666"
          />
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            title="Avg Session"
            value={Math.round(stats.averageSessionLength)}
            subtitle="minutes"
            icon={Target}
            color="#888"
          />
          <StatCard
            title="Current Streak"
            value={stats.currentStreak}
            subtitle="days"
            icon={Zap}
            color="#999"
          />
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            title="Best Streak"
            value={stats.longestStreak}
            subtitle="days"
            icon={Award}
            color="#aaa"
          />
          <StatCard
            title="Consistency"
            value={stats.sessionsCount > 0 ? Math.round((stats.currentStreak / 7) * 100) : 0}
            subtitle="% this week"
            icon={TrendingUp}
            color="#666"
          />
        </View>

        {trainingByType.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Training Breakdown</Text>
            <View style={styles.breakdownContainer}>
              {trainingByType.map(({ type, count }) => {
                const total = trainingByType.reduce((sum, t) => sum + t.count, 0);
                const percentage = Math.round((count / total) * 100);
                
                return (
                  <View key={type} style={styles.breakdownItem}>
                    <View style={styles.breakdownHeader}>
                      <View style={styles.breakdownLabel}>
                        <View style={[styles.breakdownDot, { backgroundColor: typeColors[type] }]} />
                        <Text style={styles.breakdownText}>{typeLabels[type]}</Text>
                      </View>
                      <Text style={styles.breakdownCount}>{count}</Text>
                    </View>
                    <View style={styles.breakdownBar}>
                      <View 
                        style={[
                          styles.breakdownProgress, 
                          { 
                            width: `${percentage}%`,
                            backgroundColor: typeColors[type]
                          }
                        ]} 
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}
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
    padding: 20,
    paddingBottom: 40,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#07a7f7',
  },
  periodText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  periodTextActive: {
    color: '#fff',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  breakdownContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  breakdownItem: {
    marginBottom: 16,
  },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  breakdownLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  breakdownDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  breakdownText: {
    color: '#ccc',
    fontSize: 14,
  },
  breakdownCount: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  breakdownBar: {
    height: 6,
    backgroundColor: '#262626',
    borderRadius: 3,
    overflow: 'hidden',
  },
  breakdownProgress: {
    height: '100%',
    borderRadius: 3,
  },
});
