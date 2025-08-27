import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import { TimerSettings } from '@/types/training';

const TIMER_SETTINGS_KEY = 'timer_settings';

export const [TimerProvider, useTimer] = createContextHook(() => {
  // All useState hooks must be called first, in the same order every time
  const [settings, setSettings] = useState<TimerSettings>({
    rounds: 5,
    roundTime: 300, // 5 minutes
    restTime: 60, // 1 minute
  });
  const [currentRound, setCurrentRound] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(300); // Use fixed initial value
  const [isResting, setIsResting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [soundsEnabled, setSoundsEnabled] = useState(true);

  // All useRef hooks must be called next, in the same order every time
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const warningSound = useRef<Audio.Sound | null>(null);
  const clackSound = useRef<Audio.Sound | null>(null);
  const endRoundSound = useRef<Audio.Sound | null>(null);
  const newRoundSound = useRef<Audio.Sound | null>(null);
  const audioContext = useRef<AudioContext | null>(null);

  // All useCallback hooks must be called in the same order every time
  const generateBeep = useCallback((frequency: number, duration: number, volume: number = 0.3): string => {
    if (Platform.OS === 'web') {
      // For web, we'll use the Web Audio API in playSound function
      return `beep-${frequency}-${duration}`;
    }
    
    // For mobile, generate a simple sine wave audio data URL
    const sampleRate = 44100;
    const samples = Math.floor(sampleRate * duration);
    const buffer = new ArrayBuffer(44 + samples * 2);
    const view = new DataView(buffer);
    
    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + samples * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, samples * 2, true);
    
    // Generate sine wave
    for (let i = 0; i < samples; i++) {
      const sample = Math.sin(2 * Math.PI * frequency * i / sampleRate) * volume * 32767;
      view.setInt16(44 + i * 2, sample, true);
    }
    
    const blob = new Blob([buffer], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  }, []);
  
  const loadSounds = useCallback(async () => {
    try {
      if (Platform.OS === 'web') {
        // Initialize Web Audio Context for web
        if (typeof window !== 'undefined' && window.AudioContext) {
          audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return; // We'll generate sounds on-demand for web
      }
      
      // For mobile, create audio objects with generated beep sounds
      const warningUri = generateBeep(800, 0.2); // 800Hz, 0.2s
      const { sound: warning } = await Audio.Sound.createAsync(
        { uri: warningUri },
        { shouldPlay: false }
      );
      warningSound.current = warning;
      
      const clackUri = generateBeep(1200, 0.1); // 1200Hz, 0.1s
      const { sound: clack } = await Audio.Sound.createAsync(
        { uri: clackUri },
        { shouldPlay: false }
      );
      clackSound.current = clack;
      
      const endRoundUri = generateBeep(600, 0.5); // 600Hz, 0.5s
      const { sound: endRound } = await Audio.Sound.createAsync(
        { uri: endRoundUri },
        { shouldPlay: false }
      );
      endRoundSound.current = endRound;
      
      const newRoundUri = generateBeep(1000, 0.15); // 1000Hz, 0.15s
      const { sound: newRound } = await Audio.Sound.createAsync(
        { uri: newRoundUri },
        { shouldPlay: false }
      );
      newRoundSound.current = newRound;
    } catch (error) {
      console.log('Error loading sounds:', error);
    }
  }, [generateBeep]);

  const unloadSounds = useCallback(async () => {
    try {
      if (warningSound.current) {
        await warningSound.current.unloadAsync();
      }
      if (clackSound.current) {
        await clackSound.current.unloadAsync();
      }
      if (endRoundSound.current) {
        await endRoundSound.current.unloadAsync();
      }
      if (newRoundSound.current) {
        await newRoundSound.current.unloadAsync();
      }
    } catch (error) {
      console.log('Error unloading sounds:', error);
    }
  }, []);

  // Load saved settings and initialize sounds
  useEffect(() => {
    const initializeApp = async () => {
      // Load settings
      const stored = await AsyncStorage.getItem(TIMER_SETTINGS_KEY);
      if (stored) {
        const savedSettings = JSON.parse(stored);
        setSettings(savedSettings);
        setTimeRemaining(savedSettings.roundTime);
      }
      
      // Initialize sounds
      if (Platform.OS !== 'web') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      }
      
      await loadSounds();
    };
    
    initializeApp();
    
    return () => {
      unloadSounds();
    };
  }, [loadSounds, unloadSounds]);
  

  
  const playWebBeep = useCallback((frequency: number, duration: number, volume: number = 0.3) => {
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
  }, []);
  
  const playSound = useCallback(async (soundType: 'warning' | 'clack' | 'endRound' | 'newRound', repeat: number = 1) => {
    if (!soundsEnabled) return;
    
    try {
      if (Platform.OS === 'web') {
        // Use Web Audio API for web
        for (let i = 0; i < repeat; i++) {
          switch (soundType) {
            case 'warning':
              playWebBeep(800, 0.2); // 800Hz, 0.2s
              break;
            case 'clack':
              playWebBeep(1200, 0.1); // 1200Hz, 0.1s
              break;
            case 'endRound':
              playWebBeep(600, 0.5); // 600Hz, 0.5s
              break;
            case 'newRound':
              playWebBeep(1000, 0.15); // 1000Hz, 0.15s
              break;
          }
          if (i < repeat - 1) {
            await new Promise(resolve => setTimeout(resolve, 200)); // 200ms delay between repeats
          }
        }
      } else {
        // Use expo-av for mobile
        let sound: Audio.Sound | null = null;
        switch (soundType) {
          case 'warning':
            sound = warningSound.current;
            break;
          case 'clack':
            sound = clackSound.current;
            break;
          case 'endRound':
            sound = endRoundSound.current;
            break;
          case 'newRound':
            sound = newRoundSound.current;
            break;
        }
        
        if (sound) {
          for (let i = 0; i < repeat; i++) {
            await sound.replayAsync();
            if (i < repeat - 1) {
              await new Promise(resolve => setTimeout(resolve, 200)); // 200ms delay between repeats
            }
          }
        }
      }
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  }, [soundsEnabled, playWebBeep]);

  // Save settings when they change
  const updateSettings = useCallback(async (newSettings: TimerSettings) => {
    setSettings(newSettings);
    setTimeRemaining(newSettings.roundTime);
    await AsyncStorage.setItem(TIMER_SETTINGS_KEY, JSON.stringify(newSettings));
  }, []);

  const handleTimerEnd = useCallback(async () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    if (isResting) {
      // End of rest, start next round
      if (currentRound < settings.rounds) {
        // Play new round sound (triple beep)
        await playSound('newRound', 3);
        setCurrentRound(prev => prev + 1);
        setIsResting(false);
      } else {
        // Timer complete
        await playSound('endRound');
        setIsRunning(false);
        setIsPaused(false);
        setCurrentRound(1);
        setIsResting(false);
        setTimeRemaining(settings.roundTime);
      }
    } else {
      // End of round
      if (currentRound < settings.rounds) {
        // Play end of round sound
        await playSound('endRound');
        setIsResting(true);
      } else {
        // All rounds complete
        await playSound('endRound');
        setIsRunning(false);
        setIsPaused(false);
        setCurrentRound(1);
        setIsResting(false);
        setTimeRemaining(settings.roundTime);
      }
    }
  }, [isResting, currentRound, settings.rounds, settings.roundTime, playSound]);

  // Timer logic
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          // Play sound notifications
          if (prev === 31) {
            // 30 seconds remaining - single warning sound
            playSound('warning');
          } else if (prev === 11) {
            // 10 seconds remaining - double clack sound
            playSound('clack', 2);
          }
          
          if (prev <= 1) {
            handleTimerEnd();
            return isResting ? settings.roundTime : settings.restTime;
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
  }, [isRunning, isPaused, isResting, settings, handleTimerEnd, playSound]);

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

  // Use useMemo to optimize context value
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