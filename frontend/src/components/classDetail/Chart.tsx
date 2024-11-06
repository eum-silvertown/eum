import React from 'react';
import { Text } from '@components/common/Text';
import { View, StyleSheet } from 'react-native';
import { spacing } from '@theme/spacing';
import { Canvas, vec } from '@shopify/react-native-skia';
import { Ring } from './Ring';
import { typography } from '@theme/typography';

const width = 120;
const height = 120;
const center = vec(width / 2, height / 2);

export const SIZE = width;
export const strokeWidth = 15;

const color = (r: number, g: number, b: number) =>
  `rgb(${r * 255}, ${g * 255}, ${b * 255})`;

type StudentScores = {
  homeworkScore: number;
  testScore: number;
  attitudeScore: number;
};

type ChartProps = {
  studentScores?: StudentScores;
};

function Chart({ studentScores }: ChartProps): React.JSX.Element {
  const averageScore = Math.round(
    ((studentScores?.homeworkScore || 0) +
      (studentScores?.testScore || 0) +
      (studentScores?.attitudeScore || 0)) /
    3
  );

  const rings = [
    {
      totalProgress: (studentScores?.homeworkScore || 0) / 100,
      colors: [color(0.0, 0.9, 0.7), color(0.2, 0.7, 1)],
      background: color(0.02, 0.25, 0.25),
      size: SIZE - strokeWidth * 4,
      label: '숙제',
    },
    {
      totalProgress: (studentScores?.testScore || 0) / 100,
      colors: [color(1, 0.8, 0), color(1, 0.6, 0.2)],
      background: color(0.3, 0.2, 0),
      size: SIZE - strokeWidth * 2,
      label: '시험',
    },
    {
      totalProgress: (studentScores?.attitudeScore || 0) / 100,
      colors: [color(1, 0.3, 0.4), color(1, 0.5, 0.6)],
      background: color(0.2, 0, 0.1),
      size: SIZE,
      label: '태도',
    },
  ];

  return (
    <View style={styles.chart}>
      <Text variant="subtitle" weight="bold" style={styles.subtitle}>
        나의 점수
      </Text>
      <View style={styles.rowContainer}>
        <Canvas style={styles.chartContainer}>
          {rings.map((ring, index) => (
            <Ring
              key={index}
              ring={ring}
              center={center}
              strokeWidth={strokeWidth}
            />
          ))}
        </Canvas>
        <View style={styles.legendContainer}>
          <View style={styles.totalScoreContainer}>
            <Text style={styles.totalScoreLabel}>총점</Text>
            <Text style={styles.totalScoreValue}>{averageScore}</Text>
            <Text style={styles.totalScoreUnit}>점</Text>
          </View>
          {rings.map((ring, index) => (
            <View key={index} style={styles.legendItem}>
              <View
                style={[styles.colorDot, { backgroundColor: ring.colors[0] }]}
              />
              <Text>{ring.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chart: {
    paddingVertical: spacing.md,
  },
  subtitle: {
    marginStart: spacing.xl,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    marginHorizontal: 'auto',
    paddingHorizontal: spacing.lg,
  },
  chartContainer: {
    width: 120,
    height: 120,
  },
  legendContainer: {
    marginLeft: spacing.xxl,
  },
  totalScoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.md,
  },
  totalScoreLabel: {
    fontSize: typography.size.caption,
    marginRight: spacing.xs,
  },
  totalScoreValue: {
    fontSize: typography.size.title,
    fontWeight: 'bold',
    marginRight: spacing.xs,
  },
  totalScoreUnit: {
    fontSize: typography.size.body,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.sm,
  },
});

export default Chart;
