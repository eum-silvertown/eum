import { getResponsiveSize } from '@utils/responsive';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface Participant {
  studentId: number;
  studentName: string;
  studentImage?: string;
  currentPage: number;
  status: 'in' | 'now' | 'out'; // 변경된 status 타입
}

interface ParticipantCardProps {
  participant: Participant;
  onPress: () => void;
  onLongPress: () => void;
}

function ParticipantCard({
  participant,
  onPress,
  onLongPress,
}: ParticipantCardProps): React.JSX.Element {
  const { studentName, studentImage, status, currentPage } = participant;

  // 상태에 따른 스타일 동적 설정
  const borderColor = {
    in: 'black', // 대기 상태: 파란색
    now: 'green', // 움직임 상태: 초록색
    out: 'gray', // 나간 상태: 회색
  }[status];

  const opacity = status === 'out' ? 0.5 : 1; // 나간 상태일 경우 불투명도 감소

  return (
    <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
      <View style={[styles.card, { borderColor, opacity }]}>
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
      <Text style={styles.pageInfo}>{currentPage}페이지 입니다</Text>
    </TouchableOpacity>
  );
}

export default ParticipantCard;

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
  pageInfo: {
    textAlign: 'center',
    marginTop: getResponsiveSize(8),
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
});
