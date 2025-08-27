import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useMemo } from 'react';
import { TrainingSession, TrainingStats } from '@/types/training';

const STORAGE_KEY = 'training_sessions';

export const [TrainingProvider, useTraining] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [sessions, setSessions] = useState<TrainingSession[]>([]);

  const sessionsQuery = useQuery({
    queryKey: ['training-sessions'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (sessions: TrainingSession[]) => {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
      return sessions;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-sessions'] });
    }
  });

  useEffect(() => {
    if (sessionsQuery.data) {
      setSessions(sessionsQuery.data);
    }
  }, [sessionsQuery.data]);

  const addSession = (session: Omit<TrainingSession, 'id'>) => {
    const newSession: TrainingSession = {
      ...session,
      id: Date.now().toString(),
    };
    const updated = [...sessions, newSession];
    setSessions(updated);
    saveMutation.mutate(updated);
  };

  const updateSession = (id: string, updates: Partial<TrainingSession>) => {
    const updated = sessions.map(s => 
      s.id === id ? { ...s, ...updates } : s
    );
    setSessions(updated);
    saveMutation.mutate(updated);
  };

  const deleteSession = (id: string) => {
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    saveMutation.mutate(updated);
  };

  const getStats = (period: 'week' | 'month' | 'year' | 'all'): TrainingStats => {
    const now = new Date();
    let filteredSessions = sessions;

    if (period !== 'all') {
      const startDate = new Date();
      if (period === 'week') {
        startDate.setDate(now.getDate() - 7);
      } else if (period === 'month') {
        startDate.setMonth(now.getMonth() - 1);
      } else if (period === 'year') {
        startDate.setFullYear(now.getFullYear() - 1);
      }

      filteredSessions = sessions.filter(s => 
        new Date(s.date) >= startDate
      );
    }

    const totalMinutes = filteredSessions.reduce((sum, s) => sum + s.duration, 0);
    const totalHours = totalMinutes / 60;
    const sessionsCount = filteredSessions.length;
    const averageSessionLength = sessionsCount > 0 ? totalMinutes / sessionsCount : 0;

    // Calculate streaks
    const sortedSessions = [...sessions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;

    for (const session of sortedSessions) {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0);

      if (!lastDate) {
        tempStreak = 1;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const daysDiff = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff <= 1) {
          currentStreak = 1;
        }
      } else {
        const daysDiff = Math.floor((lastDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff <= 1) {
          tempStreak++;
          if (currentStreak > 0 || daysDiff === 0) {
            currentStreak = tempStreak;
          }
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }

      lastDate = sessionDate;
    }

    longestStreak = Math.max(longestStreak, tempStreak);

    return {
      totalHours,
      sessionsCount,
      averageSessionLength,
      currentStreak,
      longestStreak,
      lastTrainingDate: sortedSessions[0]?.date || null,
    };
  };

  const getSessionsByDate = (date: string) => {
    return sessions.filter(s => s.date === date);
  };

  const getTodaySessions = () => {
    const today = new Date().toISOString().split('T')[0];
    return getSessionsByDate(today);
  };

  return {
    sessions,
    isLoading: sessionsQuery.isLoading,
    addSession,
    updateSession,
    deleteSession,
    getStats,
    getSessionsByDate,
    getTodaySessions,
  };
});