import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@components/common/Text';
import { useModalContext } from '@contexts/useModalContext';

interface ExamOverviewModalProps {
  score: number;
  correctCount: number;
  totalCount: number;
  onConfirm: () => void;
}

function OverviewModal({
  score,
  correctCount,
  totalCount,
  onConfirm,
}: ExamOverviewModalProps): React.JSX.Element {
  const { close } = useModalContext();

  const handleConfirm = () => {
    close();
    onConfirm();
  };

  return (
    <View style={styles.container}>
      <View style={styles.overview}>
        <Text>점수: {score}</Text>
        <Text>
          정답: {correctCount} / {totalCount}
        </Text>
      </View>
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text weight="bold" align="center" style={styles.confirmText}>
          확인
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  overview: {
    marginVertical: 15,
    alignItems: 'center',
  },
  confirmButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
  },
});
export default OverviewModal;
