import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Platform, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { TrainingProvider } from './hooks/training-context';
import { TimerProvider } from './hooks/timer-context';

// Import screens
import DashboardScreen from './app/(tabs)/index';
import LogScreen from './app/(tabs)/log';
import StatsScreen from './app/(tabs)/stats';
import TimerScreen from './app/(tabs)/timer';
import AddSessionScreen from './app/add-session';
import EditSessionScreen from './app/edit-session';

// Import icons
import { Home, BarChart3, Timer, BookOpen } from 'lucide-react-native';

const queryClient = new QueryClient();

function WebApp() {
  const [currentScreen, setCurrentScreen] = React.useState('Home');
  const [modalScreen, setModalScreen] = React.useState(null);
  const [sessionId, setSessionId] = React.useState(null);

  const handleNavigation = {
    goToAddSession: () => setModalScreen('AddSession'),
    goToEditSession: (id) => {
      setSessionId(id);
      setModalScreen('EditSession');
    },
    goBack: () => setModalScreen(null),
    push: (screen, params) => {
      if (screen === '/add-session') {
        setModalScreen('AddSession');
      } else if (screen.includes('/edit-session')) {
        const id = params?.id || screen.split('id=')[1];
        setSessionId(id);
        setModalScreen('EditSession');
      }
    }
  };

  const renderScreen = () => {
    if (modalScreen === 'AddSession') {
      return <AddSessionScreen router={handleNavigation} />;
    }
    if (modalScreen === 'EditSession') {
      return <EditSessionScreen router={handleNavigation} sessionId={sessionId} />;
    }

    switch (currentScreen) {
      case 'Home':
        return <DashboardScreen router={handleNavigation} />;
      case 'Training Log':
        return <LogScreen router={handleNavigation} />;
      case 'Statistics':
        return <StatsScreen />;
      case 'Round Timer':
        return <TimerScreen />;
      default:
        return <DashboardScreen router={handleNavigation} />;
    }
  };

  const tabs = [
    { name: 'Home', icon: Home },
    { name: 'Training Log', icon: BookOpen },
    { name: 'Statistics', icon: BarChart3 },
    { name: 'Round Timer', icon: Timer },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {renderScreen()}
      </View>
      
      {!modalScreen && (
        <View style={styles.tabBar}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentScreen === tab.name;
            return (
              <TouchableOpacity
                key={tab.name}
                style={styles.tab}
                onPress={() => setCurrentScreen(tab.name)}
              >
                <Icon size={24} color={isActive ? '#07a7f7' : '#666'} />
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tab.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TrainingProvider>
        <TimerProvider>
          <WebApp />
        </TimerProvider>
      </TrainingProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#0d0d0d',
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
    paddingBottom: Platform.OS === 'web' ? 0 : 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  tabTextActive: {
    color: '#07a7f7',
  },
});