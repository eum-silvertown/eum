// AddTodoModal.tsx
import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {Text} from '@components/common/Text';
import InputField from '@components/account/InputField';
import {spacing} from '@theme/spacing';
import {colors} from 'src/hooks/useColors';

const AddTodoModal = (): React.JSX.Element => {
  const importanceLevels = ['일반', '평범', '중요', '매우 중요'];

  const createTodo = () => {
    // TODO: 할 일 생성 로직
  };

  return (
    <View>
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

      <View style={[styles.contentContainer]}>
        <Text variant="subtitle" weight="bold">
          내용
        </Text>
        <InputField placeholder="내용을 입력해주세요." />
      </View>

      <TouchableOpacity onPress={createTodo} style={styles.submitButton}>
        <Text color="white" weight="bold" align="center">
          생성
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    marginBottom: spacing.xl,
  },
  importanceLevelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  importanceButton: {
    flex: 1,
    backgroundColor: colors.light.background.main,
    padding: spacing.md,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: colors.light.background.main,
    padding: spacing.md,
    alignItems: 'center',
    borderRadius: 5,
  },
});

export default AddTodoModal;
