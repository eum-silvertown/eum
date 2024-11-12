import React from 'react';
import {StyleSheet, View, ViewStyle, TextStyle} from 'react-native';
import {Text} from '@components/common/Text';
import {colors} from 'src/hooks/useColors';
import {spacing} from '@theme/spacing';

interface StatusMessageProps {
  message?: string | undefined; // 메시지 텍스트
  status?: 'error' | 'success' | 'info' | '';
  style?: ViewStyle | TextStyle; // 추가 스타일
}

function StatusMessage({
  message,
  status = 'info',
  style,
}: StatusMessageProps): React.JSX.Element | null {
  // 메시지가 없으면 표시하지 않음
  if (!message) return null;

  // 상태에 따른 스타일 지정
  const messageStyle = [
    status === 'error' && styles.errorMessage,
    status === 'success' && styles.successMessage,
    style,
  ];

  return (
    <Text variant="caption" style={messageStyle}>
      {message}
    </Text>
  );
}

export default StatusMessage;

const styles = StyleSheet.create({
  errorMessage: {
    color: colors.light.text.error,
  },
  successMessage: {
    color: colors.light.text.success,
  },
});
