import React, {useEffect, useState} from 'react';
import {Text} from '@components/common/Text';
import {View, StyleSheet} from 'react-native';
import {Canvas, vec} from '@shopify/react-native-skia';
import {Ring} from './Ring';
import {typography} from '@theme/typography';
import {getResponsiveSize} from '@utils/responsive';
import {ClassAverageScoresType} from 'src/services/lectureInformation';

const width = 120;
const height = 120;
const center = vec(width / 2, height / 2);

export const SIZE = width;
export const strokeWidth = 15;

const color = (r: number, g: number, b: number) =>
  `rgb(${r * 255}, ${g * 255}, ${b * 255})`;

type ChartProps = {
  classAverageScores?: ClassAverageScoresType;
  studentName?: string;
};

function StudentsChart({
  classAverageScores,
  studentName,
}: ChartProps): React.JSX.Element {
  const [canvasKey, setCanvasKey] = useState(0);

  useEffect(() => {
    setCanvasKey(prevKey => prevKey + 1);
  }, [classAverageScores]);

  const averageScore = Math.round(
    ((classAverageScores?.homeworkAvgScore || 0) +
      (classAverageScores?.examAvgScore || 0) +
      (classAverageScores?.attitudeAvgScore || 0)) /
      3,
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
      totalProgress: (classAverageScores?.examAvgScore || 0) / 100,
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
                style={[styles.colorDot, {backgroundColor: ring.colors[0]}]}
              />
              <Text>
                {ring.label} {ring.totalProgress * 100}점
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chart: {
    paddingVertical: 10,
  },
  subtitle: {
    marginStart: 25,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 'auto',
    paddingHorizontal: 15,
  },
  chartContainer: {
    width: getResponsiveSize(128),
    height: getResponsiveSize(128),
  },
  legendContainer: {
    marginLeft: 40,
  },
  totalScoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  totalScoreLabel: {
    fontSize: typography.size.caption,
    marginRight: 3,
  },
  totalScoreValue: {
    fontSize: typography.size.title,
    fontWeight: 'bold',
    marginRight: 3,
  },
  totalScoreUnit: {
    fontSize: typography.size.body,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  colorDot: {
    width: getResponsiveSize(16),
    height: getResponsiveSize(16),
    borderRadius: 10,
    marginRight: 5,
  },
});

export default StudentsChart;
