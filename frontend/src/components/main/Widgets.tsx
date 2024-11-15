import {StyleSheet, useWindowDimensions, View} from 'react-native';
import TodoList from './widgets/TodoList';
import Weather from './widgets/Weather';
import CustomCalendar from './widgets/CustomCalendar';

export default function Widgets(): React.JSX.Element {
  const {width} = useWindowDimensions();
  const styles = getStyles(width);

  return (
    <View style={styles.container}>
      <TodoList />
      <Weather />
      <CustomCalendar />
    </View>
  );
}

const getStyles = (width: number) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      width: '100%',
      height: '40%',
      gap: width * 0.01,
      paddingHorizontal: width * 0.015,
    },
  });
