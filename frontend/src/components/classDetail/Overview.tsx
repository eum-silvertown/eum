import React from 'react';
import {Text} from '@components/common/Text';
import {View, StyleSheet} from 'react-native';
import ProgressBox from '@components/homework/ProgressBox';
import {spacing} from '@theme/spacing';
import {getResponsiveSize} from '@utils/responsive';

function Overview(): React.JSX.Element {
  return (
    <View style={styles.overview}>
      <Text variant="subtitle" weight="bold" style={styles.subtitle}>
        Overview
      </Text>
      <View style={styles.progressLayout}>
        <ProgressBox
          color="blue"
          title="숙제"
          content="10"
          unit="개"
          icon="complete"
        />
        <ProgressBox
          color="red"
          title="시험"
          content="10"
          unit="번"
          icon="complete"
        />
        <ProgressBox
          color="green"
          title="문제 보관함"
          content="10"
          unit="개"
          icon="complete"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overview: {
    flex: 1,
    gap: spacing.md,
  },
  subtitle: {
    marginStart: spacing.xl,
  },
  progressLayout: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.xxl,
    paddingHorizontal: getResponsiveSize(20),
  },
});

export default Overview;
