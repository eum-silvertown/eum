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
    width: getResponsiveSize(224),
    height: getResponsiveSize(128),
    margin: getResponsiveSize(6),
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    position: 'relative',
  },
  name: {
    position: 'absolute',
    bottom: getResponsiveSize(12),
    right: getResponsiveSize(12),
    backgroundColor: 'rgba(128, 128, 128, 0.7)',
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: getResponsiveSize(9),
    paddingVertical: getResponsiveSize(3),
    borderRadius: getResponsiveSize(6),
  },
});

export default ParticipantCard;
