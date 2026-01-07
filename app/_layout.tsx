import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
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

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TrainingProvider>
        <TimerProvider>
          {children}
        </TimerProvider>
      </TrainingProvider>
    </QueryClientProvider>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(console.warn);
  }, []);

  return (
    <Providers>
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
    </Providers>
  );
}
