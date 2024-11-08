import React, { useEffect, useState } from 'react';
import { Text } from '@components/common/Text';
import { View, StyleSheet } from 'react-native';
import { spacing } from '@theme/spacing';
import { Canvas, vec } from '@shopify/react-native-skia';
import { Ring } from './Ring';
import { typography } from '@theme/typography';
import { getResponsiveSize } from '@utils/responsive';

const width = 120;
const height = 120;
const center = vec(width / 2, height / 2);

export const SIZE = width;
export const strokeWidth = 15;

const color = (r: number, g: number, b: number) =>
  `rgb(${r * 255}, ${g * 255}, ${b * 255})`;

type ClassAverageScores = {
  homeworkAvgScore: number;
  testAvgScore: number;
  attitudeAvgScore: number;
};

type ChartProps = {
  classAverageScores?: ClassAverageScores;
  studentName?: string;
};

function StudentsChart({ classAverageScores, studentName }: ChartProps): React.JSX.Element {
  const [canvasKey, setCanvasKey] = useState(0);

  useEffect(() => {
    setCanvasKey((prevKey) => prevKey + 1);
  }, [classAverageScores]);

  const averageScore = Math.round(
    ((classAverageScores?.homeworkAvgScore || 0) +
      (classAverageScores?.testAvgScore || 0) +
      (classAverageScores?.attitudeAvgScore || 0)) / 3
  );

  const rings = [
    {
      totalProgress: (classAverageScores?.homeworkAvgScore || 0) / 100,
      colors: [color(0.0, 0.9, 0.7), color(0.2, 0.7, 1)],
      background: color(0.02, 0.25, 0.25),
      size: SIZE - strokeWidth * 4,
      label: '숙제',
    },
    {
      totalProgress: (classAverageScores?.testAvgScore || 0) / 100,
      colors: [color(1, 0.8, 0), color(1, 0.6, 0.2)],
      background: color(0.3, 0.2, 0),
      size: SIZE - strokeWidth * 2,
      label: '시험',
    },
    {
      totalProgress: (classAverageScores?.attitudeAvgScore || 0) / 100,
      colors: [color(1, 0.3, 0.4), color(1, 0.5, 0.6)],
      background: color(0.2, 0, 0.1),
      size: SIZE,
      label: '태도',
    },
  ];

  return (
    <View style={styles.chart}>
      <Text variant="subtitle" weight="bold" style={styles.subtitle}>
        {studentName ? `${studentName} 학생 점수` : '학급 평균 점수'}
      </Text>
      <View style={styles.rowContainer}>
        <Canvas style={styles.chartContainer} key={canvasKey}>
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
              <Text>{ring.label} {ring.totalProgress * 100}점</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chart: {
    paddingVertical: spacing.sm,
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
    width: getResponsiveSize(120),
    height: getResponsiveSize(120),
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
    width: getResponsiveSize(12),
    height: getResponsiveSize(12),
    borderRadius: 6,
    marginRight: spacing.sm,
  },
});

export default StudentsChart;