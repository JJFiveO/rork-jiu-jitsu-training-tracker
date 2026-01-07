import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
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

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(console.warn);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TrainingProvider>
        <TimerProvider>
          <Slot />
        </TimerProvider>
      </TrainingProvider>
    </QueryClientProvider>
  );
}
