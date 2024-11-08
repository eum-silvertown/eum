import {getResponsiveSize} from '@utils/responsive';
import {StyleSheet, View} from 'react-native';
import {Text} from '@components/common/Text';
import {borderRadius} from '@theme/borderRadius';
import {Canvas, vec} from '@shopify/react-native-skia';
import {Ring} from '@components/classDetail/Ring';
import {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';

function ProgressChart(): React.JSX.Element {
  const SIZE = getResponsiveSize(125);
  const center = vec(SIZE / 2, SIZE / 2);
  const strokeWidth = 15;

  const color = (r: number, g: number, b: number) =>
    `rgb(${r * 255}, ${g * 255}, ${b * 255})`;

  const rings = [
    {
      totalProgress: 0.8,
      colors: [color(0.0, 0.9, 0.7), color(0.2, 0.7, 1)],
      background: color(0.02, 0.25, 0.25),
      size: SIZE,
      label: `${0.8 * 100}%`,
    },
  ];

  // 페이지가 Focus 될 때 Animation을 재적용
  const [key, setKey] = useState(0);
  useFocusEffect(
    useCallback(() => {
      setKey(prev => prev + 1);
    }, []),
  );

  return (
    <View key={key} style={styles.chartContainer}>
      <View style={styles.chart}>
        <Canvas style={{width: SIZE, height: SIZE}}>
          {rings.map((ring, index) => (
            <Ring
              key={index}
              ring={ring}
              center={center}
              strokeWidth={strokeWidth}
            />
          ))}
        </Canvas>
        <View style={styles.centerLabel}>
          {rings.map((ring, index) => (
            <View key={index}>
              <Text>{ring.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

export default ProgressChart;

const styles = StyleSheet.create({
  chartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffff99',
    borderRadius: borderRadius.lg,
    elevation: getResponsiveSize(4),
  },
  chart: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerLabel: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
