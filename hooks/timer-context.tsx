import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Platform } from 'react-native';
import { TimerSettings } from '@/types/training';

const TIMER_SETTINGS_KEY = 'timer_settings';

export const [TimerProvider, useTimer] = createContextHook(() => {
  const [settings, setSettings] = useState<TimerSettings>({
    rounds: 5,
    roundTime: 300,
    restTime: 60,
  });
  const [currentRound, setCurrentRound] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(300);
  const [isResting, setIsResting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [soundsEnabled, setSoundsEnabled] = useState(true);

  // All useRef calls must come before useCallback calls
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioContext = useRef<AudioContext | null>(null);

  const playWebBeep = useCallback((frequency: number, duration: number, volume: number = 0.3) => {
    if (Platform.OS !== 'web' || !soundsEnabled) return;
    
    try {
      if (!audioContext.current && typeof window !== 'undefined') {
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      if (!audioContext.current) return;
      
      const oscillator = audioContext.current.createOscillator();
      const gainNode = audioContext.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.current.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.current.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.current.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.current.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.current.currentTime + duration);
      
      oscillator.start(audioContext.current.currentTime);
      oscillator.stop(audioContext.current.currentTime + duration);
    } catch (error) {
      console.log('Error playing web beep:', error);
    }
  }, [soundsEnabled]);

  const playSound = useCallback(async (soundType: 'warning' | 'clack' | 'endRound' | 'newRound', repeat: number = 1) => {
    if (!soundsEnabled) return;
    
    try {
      for (let i = 0; i < repeat; i++) {
        switch (soundType) {
          case 'warning':
            playWebBeep(800, 0.2);
            break;
          case 'clack':
            playWebBeep(1200, 0.1);
            break;
          case 'endRound':
            playWebBeep(600, 0.5);
            break;
          case 'newRound':
            playWebBeep(1000, 0.15);
            break;
        }
        if (i < repeat - 1) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  }, [soundsEnabled, playWebBeep]);

  const updateSettings = useCallback(async (newSettings: TimerSettings) => {
    setSettings(newSettings);
    setTimeRemaining(newSettings.roundTime);
    try {
      await AsyncStorage.setItem(TIMER_SETTINGS_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.log('Error saving settings:', error);
    }
  }, []);

  const handleTimerEnd = useCallback(async () => {
    if (isResting) {
      if (currentRound < settings.rounds) {
        await playSound('newRound', 3);
        setCurrentRound(prev => prev + 1);
        setIsResting(false);
        setTimeRemaining(settings.roundTime);
      } else {
        await playSound('endRound');
        setIsRunning(false);
        setIsPaused(false);
        setCurrentRound(1);
        setIsResting(false);
        setTimeRemaining(settings.roundTime);
      }
    } else {
      if (currentRound < settings.rounds) {
        await playSound('endRound');
        setIsResting(true);
        setTimeRemaining(settings.restTime);
      } else {
        await playSound('endRound');
        setIsRunning(false);
        setIsPaused(false);
        setCurrentRound(1);
        setIsResting(false);
        setTimeRemaining(settings.roundTime);
      }
    }
  }, [isResting, currentRound, settings, playSound]);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const stored = await AsyncStorage.getItem(TIMER_SETTINGS_KEY);
        if (stored) {
          const savedSettings = JSON.parse(stored);
          setSettings(savedSettings);
          setTimeRemaining(savedSettings.roundTime);
        }
      } catch (error) {
        console.log('Error loading settings:', error);
      }
    };
    
    loadSettings();
  }, []);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === 31) {
            playSound('warning');
          } else if (prev === 11) {
            playSound('clack', 2);
          }
          
          if (prev <= 1) {
            handleTimerEnd();
            return prev;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, handleTimerEnd, playSound]);

  const startTimer = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resumeTimer = useCallback(() => {
    setIsPaused(false);
  }, []);

  const stopTimer = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentRound(1);
    setIsResting(false);
    setTimeRemaining(settings.roundTime);
  }, [settings.roundTime]);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentRound(1);
    setIsResting(false);
    setTimeRemaining(settings.roundTime);
  }, [settings.roundTime]);

  return useMemo(() => ({
    settings,
    updateSettings,
    currentRound,
    timeRemaining,
    isResting,
    isRunning,
    isPaused,
    soundsEnabled,
    setSoundsEnabled,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
  }), [
    settings,
    updateSettings,
    currentRound,
    timeRemaining,
    isResting,
    isRunning,
    isPaused,
    soundsEnabled,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
  ]);
});