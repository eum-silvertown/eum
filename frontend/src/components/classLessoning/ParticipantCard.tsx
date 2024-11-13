import {getResponsiveSize} from '@utils/responsive';
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
    width: getResponsiveSize(140),
    height: getResponsiveSize(80),
    margin: getResponsiveSize(4),
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    position: 'relative',
  },
  name: {
    position: 'absolute',
    bottom: getResponsiveSize(8),
    right: getResponsiveSize(8),
    backgroundColor: 'rgba(128, 128, 128, 0.7)',
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: getResponsiveSize(6),
    paddingVertical: getResponsiveSize(2),
    borderRadius: getResponsiveSize(4),
  },
});

export default ParticipantCard;
