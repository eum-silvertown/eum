import React from 'react';
import {Text} from '@components/common/Text';
import {View, StyleSheet} from 'react-native';
import {spacing} from '@theme/spacing';
import {ProgressChart} from 'react-native-chart-kit';

function Chart(): React.JSX.Element {
  const data = {
    labels: ['Swim', 'Bike', 'Run'], // optional
    data: [0.4, 0.6, 0.8],
  };
  return (
    <View style={styles.chart}>
      <Text variant="subtitle" weight="bold" style={styles.subtitle}>
        Score
      </Text>
      <ProgressChart
        data={data}
        width={200}
        height={220}
        strokeWidth={16}
        radius={32}
        chartConfig={{
          backgroundGradientFrom: '#1E2923',
          backgroundGradientFromOpacity: 0,
          backgroundGradientTo: '#08130D',
          backgroundGradientToOpacity: 0.5,
          color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
          strokeWidth: 2, // optional, default 3
          barPercentage: 0.5,
          useShadowColorFromDataset: false, // optional
        }}
        hideLegend={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  chart: {
    paddingVertical: spacing.lg,
  },
  subtitle: {
    marginStart: spacing.xl,
  },
});

export default Chart;
