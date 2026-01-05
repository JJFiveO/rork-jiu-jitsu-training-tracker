import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus, Calendar } from 'lucide-react-native';
import { useTraining } from '@/hooks/training-context';
import { SessionCard } from '@/components/SessionCard';
import { TrainingSession } from '@/types/training';

export default function LogScreen() {
  const router = useRouter();
  const { sessions, deleteSession } = useTraining();
  const [filterType, setFilterType] = useState<TrainingSession['type'] | 'all'>('all');

  const sortedSessions = [...sessions]
    .filter(s => filterType === 'all' || s.type === filterType)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Session',
      'Are you sure you want to delete this training session?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteSession(id)
        }
      ]
    );
  };

  const filterOptions: { value: TrainingSession['type'] | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'gi', label: 'Gi' },
    { value: 'no-gi', label: 'No-Gi' },
    { value: 'open-mat', label: 'Open Mat' },
    { value: 'competition', label: 'Comp' },
    { value: 'drilling', label: 'Drilling' },
    { value: 'private', label: 'Private' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          {filterOptions.map(option => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.filterChip,
                filterType === option.value && styles.filterChipActive
              ]}
              onPress={() => setFilterType(option.value)}
            >
              <Text style={[
                styles.filterText,
                filterType === option.value && styles.filterTextActive
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {sortedSessions.length > 0 ? (
          sortedSessions.map(session => (
            <SessionCard
              key={session.id}
              session={session}
              onEdit={() => router.push(`/edit-session?id=${session.id}`)}
              onDelete={() => handleDelete(session.id)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Calendar size={48} color="#666" />
            <Text style={styles.emptyTitle}>No training sessions</Text>
            <Text style={styles.emptyText}>
              {filterType !== 'all' 
                ? `No ${filterOptions.find(o => o.value === filterType)?.label} sessions yet`
                : 'Start logging your training to track progress'}
            </Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/add-session')}
      >
        <Plus size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  filterScroll: {
    flexGrow: 0,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#07a7f7',
  },
  filterText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#07a7f7',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
