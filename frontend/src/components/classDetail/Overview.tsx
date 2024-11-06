import React from 'react';
import { Text } from '@components/common/Text';
import { View, StyleSheet } from 'react-native';
import ProgressBox from '@components/homework/ProgressBox';
import { spacing } from '@theme/spacing';
import { getResponsiveSize } from '@utils/responsive';

type OverviewProps = {
  homeworkCnt?: number;
  examCnt?: number;
  problemBoxCnt?: number;
};

function Overview({ homeworkCnt = 0, examCnt = 0, problemBoxCnt = 0 }: OverviewProps): React.JSX.Element {
  return (
    <View style={styles.overview}>
      <Text variant="subtitle" weight="bold" style={styles.subtitle}>
        Overview
      </Text>
      <View style={styles.progressLayout}>
        <ProgressBox
          color="red"
          title="시험"
          content={`${examCnt}`}
          unit="번"
          icon="complete"
        />
        <ProgressBox
          color="blue"
          title="숙제"
          content={`${homeworkCnt}`}
          unit="개"
          icon="homeworkCheck"
        />
        <ProgressBox
          color="green"
          title="문제 보관함"
          content={`${problemBoxCnt}`}
          unit="개"
          icon="folderCheck"
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
