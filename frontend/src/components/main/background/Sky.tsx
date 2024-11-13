import {Animated, StyleSheet} from 'react-native';

interface TimeColor {
  startHour: number;
  color: string;
}

interface SkyProps {
  skyAnim: Animated.Value;
}

export default function Sky({skyAnim}: SkyProps): React.JSX.Element {
  const timeColors: TimeColor[] = [
    {startHour: 9, color: '#87CEEB'}, // 아침
    {startHour: 12, color: '#87CEFA'}, // 낮
    {startHour: 16, color: '#FFA07A'}, // 오후
    {startHour: 19, color: '#4B0082'}, // 저녁
    {startHour: 22, color: '#191970'}, // 밤
  ];

  // 배경색 보간
  const interpolatedColor = skyAnim.interpolate({
    inputRange: timeColors.map((_, index) => index / (timeColors.length + 1)),
    outputRange: timeColors.map(color => color.color),
  });

  return (
    <Animated.View
      style={[
        styles.background,
        {
          backgroundColor: interpolatedColor,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
  },
});
