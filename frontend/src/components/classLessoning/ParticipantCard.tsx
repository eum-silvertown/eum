import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

interface Participant {
  id: string;
  name: string;
  isTeacher?: boolean;
}

interface ParticipantCardProps {
  participant: Participant;
  onPress: () => void;
}

const ParticipantCard: React.FC<ParticipantCardProps> = ({
  participant,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.card}>
        <Text style={styles.name}>{participant.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 302,
    height: 172,
    margin: 8,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    position: 'relative',
  },
  name: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(128, 128, 128, 0.7)',
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
});

export default ParticipantCard;
