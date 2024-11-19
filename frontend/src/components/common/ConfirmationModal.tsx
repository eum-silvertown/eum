import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@components/common/Text';
import { borderRadius } from '@theme/borderRadius';
import { colors } from '@hooks/useColors';
import { useModalContext } from '@contexts/useModalContext';

interface ConfirmationModalProps {
  onConfirm?: () => void; // '예' 버튼 클릭 시 실행될 함수
  onCancel?: () => void; // '아니오' 버튼 클릭 시 실행될 함수
}

const ConfirmationModal = ({
  onConfirm,
  onCancel,
}: ConfirmationModalProps): React.JSX.Element => {
  const { close } = useModalContext();
  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    close(); // 모달 닫기
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    close(); // 모달 닫기
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: colors.light.background.danger },
          ]}
          onPress={handleConfirm}>
          <Text weight="bold" color="white">
            예
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleCancel}>
          <Text weight="bold" color="white">
            아니오
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.light.background.main,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: borderRadius.md,
  },
});

export default ConfirmationModal;
