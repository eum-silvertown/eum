import {Animated, StyleSheet, useWindowDimensions, View} from 'react-native';
import TodoList from './widgets/TodoList';
import Weather from './widgets/Weather';
import MainHeader from './MainHeader';

interface WidgetsProps {
  isNightTime: Animated.AnimatedInterpolation<string | number>;
}

export default function Widgets({
  isNightTime,
}: WidgetsProps): React.JSX.Element {
  const {width} = useWindowDimensions();
  const styles = getStyles(width);

  return (
    <View style={styles.container}>
      <MainHeader isNightTime={isNightTime} />
      <View style={styles.widgetContainer}>
        <TodoList />
        <Weather />
      </View>
    </View>
  );
}

const getStyles = (width: number) =>
  StyleSheet.create({
    container: {
      height: '40%',
    },
    widgetContainer: {
      flex: 1,
      flexDirection: 'row',
      width: '66%',
      gap: width * 0.01,
      paddingHorizontal: width * 0.015,
    },
  });
