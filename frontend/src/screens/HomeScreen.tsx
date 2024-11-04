import {Text} from '@components/common/Text';
import {spacing} from '@theme/spacing';
import {StyleSheet, View} from 'react-native';
import MainHeader from '@components/main/MainHeader';
import TodoList from '@components/main/TodoList';
import Weather from '@components/main/Weather';
import Calendar from '@components/main/MainCalendar';
import Timetalbe from '@components/main/Timetable';

function HomeScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <MainHeader />

      <View style={styles.content}>
        <View style={styles.contentTop}>
          <TodoList />
          <Weather />
          <Calendar />
        </View>
        <View style={styles.contentBottom}>
          <Timetalbe />
        </View>
      </View>
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  content: {
    flex: 1,
    gap: spacing.lg,
    marginVertical: spacing.md,
  },
  contentTop: {
    flexDirection: 'row',
    flex: 2,
    gap: spacing.lg,
  },
  contentBottom: {
    flex: 3,
    marginBottom: spacing.sm
  },
});
