import React from 'react';
import {Text} from '@components/common/Text';
import {View, StyleSheet} from 'react-native';

function Overview(): React.JSX.Element {
  return (
    <View style={styles.overview}>
      <Text>Overview</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Overview;
