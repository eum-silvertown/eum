import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type EmptyDataProps = {
  message: string;
};

function EmptyData({ message }: EmptyDataProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    color: '#9e9e9e', // 회색 톤의 색상
    fontSize: 16,
    textAlign: 'center',
  },
});

export default EmptyData;
