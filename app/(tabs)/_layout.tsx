import { Tabs } from "expo-router";
import { Home, BarChart3, Timer, BookOpen } from "lucide-react-native";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#07a7f7',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#0d0d0d',
          borderTopColor: '#1a1a1a',
        },
        headerStyle: {
          backgroundColor: '#0d0d0d',
        },
        headerTintColor: '#fff',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          title: "Training Log",
          tabBarIcon: ({ color }) => <BookOpen size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Statistics",
          tabBarIcon: ({ color }) => <BarChart3 size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="timer"
        options={{
          title: "Round Timer",
          tabBarIcon: ({ color }) => <Timer size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
