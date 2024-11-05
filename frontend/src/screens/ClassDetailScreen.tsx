import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { spacing } from '@theme/spacing';
import Chart from '@components/classDetail/Chart';
import ClassHeader from '@components/classDetail/ClassHeader';
import Homework from '@components/classDetail/Homework';
import Notice from '@components/classDetail/Notice';
import Overview from '@components/classDetail/Overview';
import Replay from '@components/classDetail/Replay';
import Teacher from '@components/classDetail/Teacher';
import { iconSize } from '@theme/iconSize';
import BookMarkIcon from '@assets/icons/bookMarkIcon.svg';

interface ClassDetailScreenProp {
  closeBook: () => void;
}

function ClassDetailScreen({
  closeBook,
}: ClassDetailScreenProp): React.JSX.Element {
  const isTeacher = true;

  if (isTeacher) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={closeBook} style={styles.bookmarkIcon}>
          <BookMarkIcon width={iconSize.xl} height={iconSize.xl} />
        </TouchableOpacity>
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

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={closeBook} style={styles.bookmarkIcon}>
        <BookMarkIcon width={iconSize.xl} height={iconSize.xl} />
      </TouchableOpacity>
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
    position: 'relative',
  },
  bookmarkIcon: {
    position: 'absolute',
    top: -6,
    right: 12,
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
