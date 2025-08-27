import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Play, Pause, RotateCcw, Settings, X, Volume2, VolumeX } from 'lucide-react-native';
import { useTimer } from '@/hooks/timer-context';
import * as Haptics from 'expo-haptics';

export default function TimerScreen() {
  const {
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
    resetTimer,
  } = useTimer();

  const [showSettings, setShowSettings] = useState(false);
  const [tempSettings, setTempSettings] = useState(settings);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    if (!isRunning) {
      startTimer();
    } else if (isPaused) {
      resumeTimer();
    } else {
      pauseTimer();
    }
  };

  const handleReset = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    resetTimer();
  };

  const handleSaveSettings = () => {
    updateSettings(tempSettings);
    setShowSettings(false);
  };

  const progressPercentage = isResting
    ? ((settings.restTime - timeRemaining) / settings.restTime) * 100
    : ((settings.roundTime - timeRemaining) / settings.roundTime) * 100;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.timerContainer}>
          <View style={styles.statusContainer}>
            <Text style={[styles.status, isResting && styles.restStatus]}>
              {isResting ? 'REST' : 'TRAINING'}
            </Text>
            <Text style={styles.round}>
              Round {currentRound} of {settings.rounds}
            </Text>
          </View>

          <View style={styles.timerCircle}>
            <View 
              style={[
                styles.progressRing,
                { 
                  transform: [{ rotate: `${(progressPercentage * 3.6) - 90}deg` }]
                }
              ]}
            />
            <Text style={styles.time}>{formatTime(timeRemaining)}</Text>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={handleReset}
              disabled={!isRunning && timeRemaining === settings.roundTime}
            >
              <RotateCcw size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.primaryButton, isResting && styles.restButton]}
              onPress={handleStartStop}
            >
              {!isRunning || isPaused ? (
                <Play size={32} color="#fff" />
              ) : (
                <Pause size={32} color="#fff" />
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => {
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                setSoundsEnabled(!soundsEnabled);
              }}
            >
              {soundsEnabled ? (
                <Volume2 size={24} color="#fff" />
              ) : (
                <VolumeX size={24} color="#666" />
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => setShowSettings(true)}
              disabled={isRunning}
            >
              <Settings size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.quickSettings}>
          <Text style={styles.quickSettingsTitle}>Quick Settings</Text>
          <View style={styles.quickButtons}>
            <TouchableOpacity
              style={styles.quickButton}
              onPress={() => updateSettings({ rounds: 5, roundTime: 300, restTime: 60 })}
              disabled={isRunning}
            >
              <Text style={styles.quickButtonText}>5 min × 5</Text>
              <Text style={styles.quickButtonSubtext}>1 min rest</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickButton}
              onPress={() => updateSettings({ rounds: 6, roundTime: 180, restTime: 30 })}
              disabled={isRunning}
            >
              <Text style={styles.quickButtonText}>3 min × 6</Text>
              <Text style={styles.quickButtonSubtext}>30 sec rest</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickButton}
              onPress={() => updateSettings({ rounds: 10, roundTime: 120, restTime: 60 })}
              disabled={isRunning}
            >
              <Text style={styles.quickButtonText}>2 min × 10</Text>
              <Text style={styles.quickButtonSubtext}>1 min rest</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {showSettings && (
        <View style={styles.settingsModal}>
          <View style={styles.settingsContent}>
            <View style={styles.settingsHeader}>
              <Text style={styles.settingsTitle}>Timer Settings</Text>
              <TouchableOpacity onPress={() => setShowSettings(false)}>
                <X size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Rounds</Text>
              <View style={styles.settingInput}>
                <TouchableOpacity
                  style={styles.settingButton}
                  onPress={() => setTempSettings(s => ({ ...s, rounds: Math.max(1, s.rounds - 1) }))}
                >
                  <Text style={styles.settingButtonText}>-</Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.settingValue}
                  value={tempSettings.rounds.toString()}
                  onChangeText={(text) => {
                    const num = parseInt(text) || 1;
                    setTempSettings(s => ({ ...s, rounds: num }));
                  }}
                  keyboardType="numeric"
                />
                <TouchableOpacity
                  style={styles.settingButton}
                  onPress={() => setTempSettings(s => ({ ...s, rounds: s.rounds + 1 }))}
                >
                  <Text style={styles.settingButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Round Time</Text>
              <View style={styles.settingInput}>
                <TouchableOpacity
                  style={styles.settingButton}
                  onPress={() => setTempSettings(s => ({ ...s, roundTime: Math.max(30, s.roundTime - 30) }))}
                >
                  <Text style={styles.settingButtonText}>-30s</Text>
                </TouchableOpacity>
                <Text style={styles.settingValue}>{formatTime(tempSettings.roundTime)}</Text>
                <TouchableOpacity
                  style={styles.settingButton}
                  onPress={() => setTempSettings(s => ({ ...s, roundTime: s.roundTime + 30 }))}
                >
                  <Text style={styles.settingButtonText}>+30s</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Rest Time</Text>
              <View style={styles.settingInput}>
                <TouchableOpacity
                  style={styles.settingButton}
                  onPress={() => setTempSettings(s => ({ ...s, restTime: Math.max(10, s.restTime - 10) }))}
                >
                  <Text style={styles.settingButtonText}>-10s</Text>
                </TouchableOpacity>
                <Text style={styles.settingValue}>{formatTime(tempSettings.restTime)}</Text>
                <TouchableOpacity
                  style={styles.settingButton}
                  onPress={() => setTempSettings(s => ({ ...s, restTime: s.restTime + 10 }))}
                >
                  <Text style={styles.settingButtonText}>+10s</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveSettings}>
              <Text style={styles.saveButtonText}>Save Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  timerContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  status: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#22c55e',
    letterSpacing: 2,
  },
  restStatus: {
    color: '#ef4444',
  },
  round: {
    fontSize: 16,
    color: '#999',
    marginTop: 8,
  },
  timerCircle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 8,
    borderColor: '#262626',
    marginBottom: 40,
  },
  progressRing: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 8,
    borderColor: '#07a7f7',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
  },
  time: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  primaryButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  restButton: {
    backgroundColor: '#ef4444',
  },
  secondaryButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickSettings: {
    marginTop: 40,
  },
  quickSettingsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  quickButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  quickButton: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  quickButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  quickButtonSubtext: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  settingsModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    padding: 20,
  },
  settingsContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  settingItem: {
    marginBottom: 24,
  },
  settingLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 12,
  },
  settingInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingButton: {
    backgroundColor: '#262626',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  settingButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  settingValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    minWidth: 80,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#07a7f7',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});