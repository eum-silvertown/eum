// AddTodoModal.tsx
import React from 'react';
import {Modal, View, TouchableOpacity, StyleSheet} from 'react-native';
import {Text} from '@components/common/Text';
import InputField from '@components/account/InputField';
import {spacing} from '@theme/spacing';
import {colors} from 'src/hooks/useColors';
import {borderRadius} from '@theme/borderRadius';

interface AddTodoModalProps {
  visible: boolean;
  onClose: () => void;
}

const AddTodoModal: React.FC<AddTodoModalProps> = ({visible, onClose}) => {
  const importanceLevels = ['일반', '평범', '중요', '매우 중요'];

  const createTodo = () => {};

  return (
    <Modal visible={visible} transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text variant="title" weight="bold">
            해야할 일 만들기
          </Text>

          <View style={[styles.contentContainer]}>
            <Text variant="subtitle" weight="bold">
              제목
            </Text>
            <InputField placeholder="제목을 입력해주세요." />
          </View>

          <View style={styles.contentContainer}>
            <Text variant="subtitle" weight="bold">
              중요도
            </Text>
            <View style={styles.importanceLevelContainer}>
              {importanceLevels.map((item, index) => (
                <TouchableOpacity key={index} style={styles.importanceButton}>
                  <Text color="white" weight="bold" align="center">
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={[styles.contentContainer, {flex: 2}]}>
            <Text variant="subtitle" weight="bold">
              내용
            </Text>
            <View style={{flex: 1}}>
              <InputField multiline={true} placeholder="내용을 입력해주세요." />
            </View>
          </View>

          <TouchableOpacity onPress={createTodo} style={styles.submitButton}>
            <Text color='white' weight='bold' align='center'>생성</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text>닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.light.background.modalOverlay,
  },
  modalContent: {
    flex: 0.7,
    width: '50%',
    gap: spacing.lg,
    padding: spacing.xxl,
    backgroundColor: colors.light.background.white,
    borderRadius: borderRadius.lg,
  },
  contentContainer: {
    flex: 1,
    gap: spacing.sm,
  },
  importanceLevelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xl,
  },
  importanceButton: {
    flex: 1,
    backgroundColor: colors.light.background.main,
    padding: spacing.md,
  },
  submitButton: {
    backgroundColor: colors.light.background.main,
    padding: spacing.md,
    alignItems: 'center',
  },
  closeButton: {
    alignItems: 'center',
  },
});

export default AddTodoModal;
