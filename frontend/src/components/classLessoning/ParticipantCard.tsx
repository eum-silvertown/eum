import { getResponsiveSize } from '@utils/responsive';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface Participant {
  studentId: number;
  studentName: string;
  studentImage?: string;
  status: 'default' | 'active' | 'inactive';
}

interface ParticipantCardProps {
  participant: Participant;
  onPress: () => void;
}

const ParticipantCard: React.FC<ParticipantCardProps> = ({
  participant,
  onPress,
}) => {
  const { studentName, studentImage, status } = participant;

  // 상태에 따른 스타일 동적 설정
  const borderColor = {
    default: 'transparent',
    active: 'green',
    inactive: 'red',
  }[status];

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.card, { borderColor }]}>
        {studentImage ? (
          <Image
            source={{ uri: studentImage }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.defaultBackground} />
        )}
        <Text style={styles.name}>{studentName}</Text>
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
    borderWidth: 3, // 테두리 너비
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  defaultBackground: {
    width: '100%',
    height: '100%',
    backgroundColor: '#555', // 기본 배경 색상
    borderRadius: 8,
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
