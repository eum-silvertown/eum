import {spacing} from '@theme/spacing';
import {StyleSheet, View} from 'react-native';
import TodoList from './widgets/TodoList';
import Weather from './widgets/Weather';
import MainCalendar from './widgets/MainCalendar';

export default function Widgets(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <TodoList />
      <Weather />
      <MainCalendar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    height: '40%',
    gap: spacing.lg,
    padding: spacing.xl,
  },
});
