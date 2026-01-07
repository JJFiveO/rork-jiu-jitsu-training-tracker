import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TrainingProvider } from "@/hooks/training-context";
import { TimerProvider } from "@/hooks/timer-context";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5000,
    },
  },
});

function RootLayoutNav() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(console.warn);
  }, []);

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
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <TrainingProvider>
          <TimerProvider>
            <RootLayoutNav />
          </TimerProvider>
        </TrainingProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
