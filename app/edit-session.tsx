import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Calendar, Clock, Save } from 'lucide-react-native';
import { useTraining } from '@/hooks/training-context';
import { TrainingSession } from '@/types/training';
import * as Haptics from 'expo-haptics';

export default function EditSessionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string;
  const { sessions, updateSession } = useTraining();

  const session = sessions.find(s => s.id === id);

  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('');
  const [type, setType] = useState<TrainingSession['type']>('gi');
  const [notes, setNotes] = useState('');
  const [techniques, setTechniques] = useState('');

  useEffect(() => {
    if (session) {
      setDate(session.date);
      setDuration(session.duration.toString());
      setType(session.type);
      setNotes(session.notes);
      setTechniques(session.techniques?.join(', ') || '');
    }
  }, [session]);

  const trainingTypes: { value: TrainingSession['type']; label: string; color: string }[] = [
    { value: 'gi', label: 'Gi Training', color: '#07a7f7' },
    { value: 'no-gi', label: 'No-Gi', color: '#8B4513' },
    { value: 'open-mat', label: 'Open Mat', color: '#32CD32' },
    { value: 'competition', label: 'Competition', color: '#DC2626' },
    { value: 'drilling', label: 'Drilling', color: '#9333EA' },
    { value: 'private', label: 'Private Lesson', color: '#F59E0B' },
  ];

  const handleSave = () => {
    if (!duration || parseInt(duration) <= 0) {
      Alert.alert('Error', 'Please enter a valid duration');
      return;
    }

    if (!session) return;

    const techniquesList = techniques
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    updateSession(session.id, {
      date,
      duration: parseInt(duration),
      type,
      notes,
      techniques: techniquesList,
    });

    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    router.back();
  };

  if (!session) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Session not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.label}>Training Type</Text>
          <View style={styles.typeGrid}>
            {trainingTypes.map(t => (
              <TouchableOpacity
                key={t.value}
                style={[
                  styles.typeButton,
                  type === t.value && styles.typeButtonActive,
                  type === t.value && { backgroundColor: t.color }
                ]}
                onPress={() => setType(t.value)}
              >
                <Text style={[
                  styles.typeButtonText,
                  type === t.value && styles.typeButtonTextActive
                ]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Date</Text>
          <View style={styles.inputContainer}>
            <Calendar size={20} color="#666" />
            <TextInput
              style={styles.input}
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#666"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Duration (minutes)</Text>
          <View style={styles.inputContainer}>
            <Clock size={20} color="#666" />
            <TextInput
              style={styles.input}
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
              placeholder="60"
              placeholderTextColor="#666"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Techniques Practiced</Text>
          <TextInput
            style={styles.textArea}
            value={techniques}
            onChangeText={setTechniques}
            placeholder="e.g., Armbar, Triangle, Guard Pass (comma separated)"
            placeholderTextColor="#666"
            multiline
            numberOfLines={2}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={styles.textArea}
            value={notes}
            onChangeText={setNotes}
            placeholder="What did you work on? How did it go?"
            placeholderTextColor="#666"
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Save size={20} color="#fff" />
          <Text style={styles.saveButtonText}>Update Session</Text>
        </TouchableOpacity>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#999',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#1a1a1a',
    minWidth: 100,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#07a7f7',
  },
  typeButtonText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    paddingHorizontal: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 14,
  },
  textArea: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#07a7f7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
