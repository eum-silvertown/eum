import {spacing} from '@theme/spacing';
import {StyleSheet, View} from 'react-native';
import MainHeader from '@components/main/MainHeader';
import TodoList from '@components/main/TodoList';
import Weather from '@components/main/Weather';
import Calendar from '@components/main/MainCalendar';
import Timetable from '@components/main/Timetable';
import {useEffect} from 'react';
import {getUserInfo} from '@services/authService';
import {Text} from '@components/common/Text';
import MainTest from '@components/main/MainTest';

function HomeScreen(): React.JSX.Element {
  useEffect(() => {
    // 유저 정보 조회
    const fetchData = async () => {
      try {
        const response = await getUserInfo();
      } catch (error) {}
    };

    fetchData(); // 함수 호출
  }, []);

  return (
    <View style={styles.container}>
      {/* <MainHeader /> */}
      <MainTest />

      {/* <View style={styles.content}>
        <View style={styles.contentTop}>
          <TodoList />
          <Weather />
          <Calendar />
        </View>
        <View style={styles.contentBottom}>
          <Text variant="subtitle" weight="bold">
            시간표
          </Text>
          <Timetable />
        </View>
      </View> */}
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: spacing.xl,
  },
  content: {
    flex: 1,
    gap: spacing.lg,
    marginVertical: spacing.md,
  },
  contentTop: {
    flexDirection: 'row',
    flex: 4,
    gap: spacing.lg,
  },
  contentBottom: {
    flex: 5,
    gap: spacing.md,
  },
});
