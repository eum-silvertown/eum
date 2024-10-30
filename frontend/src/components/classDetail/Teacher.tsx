import React from 'react';
import {Text} from '@components/common/Text';
import {View, StyleSheet} from 'react-native';
import {spacing} from '@theme/spacing';

function Teacher(): React.JSX.Element {
  return (
    <View style={styles.teacher}>
      <Text variant="subtitle" weight="bold" style={styles.subtitle}>
        Teacher
      </Text>
      <Text>프로필사진</Text>
      <Text>전화번호</Text>
      <Text>이메일주소</Text>
      <Text>한줄 소개</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  teacher: {
    paddingVertical: spacing.lg,
  },
  subtitle: {
    marginStart: spacing.xl,
  },
});

export default Teacher;
