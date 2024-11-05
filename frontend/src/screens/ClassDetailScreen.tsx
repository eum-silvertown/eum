import {View, StyleSheet} from 'react-native';
import {spacing} from '@theme/spacing';
import Chart from '@components/classDetail/Chart';
import ClassHeader from '@components/classDetail/ClassHeader';
import Homework from '@components/classDetail/Homework';
import Notice from '@components/classDetail/Notice';
import Overview from '@components/classDetail/Overview';
import Replay from '@components/classDetail/Replay';
import Teacher from '@components/classDetail/Teacher';
import {useFocusEffect} from '@react-navigation/native';
import {useCurrentScreenStore} from '@store/useCurrentScreenStore';

function ClassDetailScreen(): React.JSX.Element {
  const setCurrentScreen = useCurrentScreenStore(
    state => state.setCurrentScreen,
  );
  useFocusEffect(() => {
    setCurrentScreen('ClassDetailScreen');
  });
  return (
    <View style={styles.container}>
      <ClassHeader />
      <View style={styles.content}>
        <View style={styles.firstRow}>
          <View style={styles.overviewLayout}>
            <Overview />
            <Notice />
          </View>
          <View style={styles.mainContentLayout}>
            <View style={styles.teacherLayout}>
              <Teacher />
            </View>
            <View style={styles.chartLayout}>
              <Chart />
            </View>
          </View>
        </View>
        <View style={styles.secondRow}>
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
    flex: 1,
    gap: spacing.md,
  },
  firstRow: {
    flex: 5.5,
    flexDirection: 'row',
    gap: spacing.md,
  },
  secondRow: {
    flex: 4.5,
    flexDirection: 'row',
    gap: spacing.md,
  },
  overviewLayout: {
    flex: 2,
    flexDirection: 'column',
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  mainContentLayout: {
    flex: 1,
    gap: spacing.md,
  },
  teacherLayout: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  chartLayout: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  replayLayout: {
    flex: 2,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  homeworkLayout: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
  },
});

export default ClassDetailScreen;
