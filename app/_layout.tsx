import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TrainingProvider } from "@/hooks/training-context";
import { TimerProvider } from "@/hooks/timer-context";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ 
      headerBackTitle: "Back",
      headerStyle: {
        backgroundColor: '#0d0d0d',
      },
      headerTintColor: '#fff',
    }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="add-session" 
        options={{ 
          title: "Log Training",
          presentation: "modal",
        }} 
      />
      <Stack.Screen 
        name="edit-session" 
        options={{ 
          title: "Edit Session",
          presentation: "modal",
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TrainingProvider>
        <TimerProvider>
          <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#0d0d0d' }}>
            <RootLayoutNav />
          </GestureHandlerRootView>
        </TimerProvider>
      </TrainingProvider>
    </QueryClientProvider>
  );
}