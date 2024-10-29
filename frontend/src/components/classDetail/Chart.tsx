import React from 'react';
import {Text} from '@components/common/Text';
import {View, StyleSheet} from 'react-native';
import {spacing} from '@theme/spacing';
import {Canvas, vec} from '@shopify/react-native-skia';
import {Ring} from './Ring';

const width = 150;
const height = 150;
const center = vec(width / 2, height / 2);

export const {PI} = Math;
export const TAU = 2 * PI;
export const SIZE = width;
export const strokeWidth = 18;

const color = (r: number, g: number, b: number) =>
  `rgb(${r * 255}, ${g * 255}, ${b * 255})`;

const rings = [
  {
    totalProgress: 0.5,
    colors: [color(0.008, 1, 0.659), color(0, 0.847, 1)],
    background: color(0.016, 0.227, 0.212),
    size: SIZE - strokeWidth * 4,
  },
  {
    totalProgress: 0.6,
    colors: [color(0.847, 1, 0), color(0.6, 1, 0.004)],
    background: color(0.133, 0.2, 0),
    size: SIZE - strokeWidth * 2,
  },
  {
    totalProgress: 0.7,
    colors: [color(0.98, 0.067, 0.31), color(0.976, 0.22, 0.522)],
    background: color(0.196, 0.012, 0.063),
    size: SIZE,
  },
];

function Chart(): React.JSX.Element {
  return (
    <View style={styles.chart}>
      <Text variant="subtitle" weight="bold" style={styles.subtitle}>
        Score
      </Text>
      <Canvas style={styles.chartContainer}>
        {rings.map((ring, index) => {
          return (
            <Ring
              key={index}
              ring={ring}
              center={center}
              strokeWidth={strokeWidth}
            />
          );
        })}
      </Canvas>

      <Text>sadaf</Text>
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
  chartContainer: {
    height: '60%',
  },
});

export default Chart;
