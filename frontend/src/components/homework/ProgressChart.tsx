import {getResponsiveSize} from '@utils/responsive';
import {PieChart} from 'react-native-gifted-charts';
import {StyleSheet, View} from 'react-native';
import {spacing} from '@theme/spacing';
import {Text} from '@components/common/Text';

function ProgressChart(): React.JSX.Element {
  const pieData = [
    {value: 80, color: '#4AA9FF', text: '80%'}, // 완료된 부분
    {value: 20, color: '#E8E8E8'}, // 남은 부분
  ];

  return (
    <View style={styles.chartContainer}>
      <View style={styles.chart}>
        <PieChart
          data={pieData}
          donut
          radius={getResponsiveSize(90)}
          innerRadius={getResponsiveSize(75)}
          isAnimated={true} // 애니메이션 활성화
          animationDuration={1000} // 애니메이션 지속 시간 (ms)
          sectionAutoFocus={true} // 섹션 자동 포커스
          // eslint-disable-next-line react/no-unstable-nested-components
          centerLabelComponent={() => {
            return (
              <View style={styles.centerLabel}>
                <Text weight="bold">80%</Text>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}

export default ProgressChart;

const styles = StyleSheet.create({
  chartContainer: {
    width: '100%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  chart: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerLabel: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
