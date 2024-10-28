import {View, StyleSheet} from 'react-native';
import {spacing} from '@theme/spacing';
import Chart from '@components/classDetail/Chart';
import ClassHeader from '@components/classDetail/ClassHeader';
import Homework from '@components/classDetail/Homework';
import Notice from '@components/classDetail/Notice';
import Overview from '@components/classDetail/Overview';
import Replay from '@components/classDetail/Replay';
import Teacher from '@components/classDetail/Teacher';

function ClassDetailScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <ClassHeader />
      <View style={styles.content}>
        <View style={styles.row}>
          <View style={styles.overviewLayout}>
            <Overview />
            <Notice />
          </View>
          <View style={styles.mainContentLayout}>
            <Teacher />
            <Chart />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.replayLayout}>
            <Replay />
          </View>
          <View style={styles.homeworkLayout}>
            <Homework />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  content: {
    flex: 8,
    gap: spacing.md,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.md,
  },
  overviewLayout: {
    flex: 2,
    flexDirection: 'column',
    gap: spacing.md,
  },
  mainContentLayout: {
    flex: 1,
    flexDirection: 'column',
    gap: spacing.md,
  },
  replayLayout: {
    flex: 2,
    backgroundColor: 'lightgray',
  },
  homeworkLayout: {
    flex: 1,
    backgroundColor: 'lightgray',
  },
});

export default ClassDetailScreen;