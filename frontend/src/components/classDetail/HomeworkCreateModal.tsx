import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {Text} from '@components/common/Text';
import InputField from '@components/account/InputField';
import {spacing} from '@theme/spacing';
import {colors} from 'src/hooks/useColors';

const HomeworkCreateModal = (): React.JSX.Element => {
  const createHomework = () => {
    // TODO: 숙제 생성 로직
  };

  return (
    <View>
      <View style={[styles.titleContainer]}>
        <Text variant="subtitle" weight="bold">
          제목
        </Text>
        <InputField placeholder="제목을 입력해주세요." />
      </View>

      <View style={[styles.contentContainer]}>
        <Text variant="subtitle" weight="bold">
          내용
        </Text>
        <InputField placeholder="내용을 입력해주세요." />
      </View>

      <TouchableOpacity onPress={createHomework} style={styles.submitButton}>
        <Text color="white" weight="bold" align="center">
          다음
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    marginBottom: spacing.xl,
  },
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

export default HomeworkCreateModal;
