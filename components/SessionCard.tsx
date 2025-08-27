import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock, Calendar, Edit2, Trash2 } from 'lucide-react-native';
import { TrainingSession } from '@/types/training';

interface SessionCardProps {
  session: TrainingSession;
  onEdit?: () => void;
  onDelete?: () => void;
}

const typeColors: Record<TrainingSession['type'], string> = {
  'gi': '#07a7f7',
  'no-gi': '#8B4513',
  'open-mat': '#32CD32',
  'competition': '#DC2626',
  'drilling': '#9333EA',
  'private': '#F59E0B',
};

const typeLabels: Record<TrainingSession['type'], string> = {
  'gi': 'Gi Training',
  'no-gi': 'No-Gi Training',
  'open-mat': 'Open Mat',
  'competition': 'Competition',
  'drilling': 'Drilling',
  'private': 'Private Lesson',
};

export const SessionCard: React.FC<SessionCardProps> = ({ 
  session, 
  onEdit, 
  onDelete 
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <View style={styles.card}>
      <View style={[styles.typeIndicator, { backgroundColor: typeColors[session.type] }]} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.typeLabel, { color: typeColors[session.type] }]}>
            {typeLabels[session.type]}
          </Text>
          <View style={styles.actions}>
            {onEdit && (
              <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
                <Edit2 size={16} color="#666" />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
                <Trash2 size={16} color="#DC2626" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.detail}>
            <Calendar size={14} color="#666" />
            <Text style={styles.detailText}>{formatDate(session.date)}</Text>
          </View>
          <View style={styles.detail}>
            <Clock size={14} color="#666" />
            <Text style={styles.detailText}>{session.duration} min</Text>
          </View>
        </View>

        {session.notes && (
          <Text style={styles.notes} numberOfLines={2}>
            {session.notes}
          </Text>
        )}

        {session.techniques && session.techniques.length > 0 && (
          <View style={styles.techniques}>
            {session.techniques.slice(0, 3).map((tech, index) => (
              <View key={index} style={styles.technique}>
                <Text style={styles.techniqueText}>{tech}</Text>
              </View>
            ))}
            {session.techniques.length > 3 && (
              <Text style={styles.moreText}>+{session.techniques.length - 3} more</Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 12,
  },
  typeIndicator: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  details: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    color: '#999',
    fontSize: 12,
  },
  notes: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  techniques: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  technique: {
    backgroundColor: '#3a3a3a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  techniqueText: {
    color: '#999',
    fontSize: 11,
  },
  moreText: {
    color: '#666',
    fontSize: 11,
    alignSelf: 'center',
    marginLeft: 4,
  },
});