import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon,
  color 
}) => {
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <View style={styles.header}>
        <Icon size={20} color={color} />
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  title: {
    color: '#999',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
});