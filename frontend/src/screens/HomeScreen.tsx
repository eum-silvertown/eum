import {Text} from '@components/common/Text';
import {spacing} from '@theme/spacing';
import {StyleSheet, View} from 'react-native';

function HomeScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="title" weight="bold">
          박효진 학생, 좋은 아침입니다.
        </Text>
      </View>
      <View style={styles.content}>
        <View style={styles.contentTop}>
          <View style={styles.todoList}>
            <Text>투두리스트</Text>
          </View>
          <View style={styles.weather}>
            <Text>날씨</Text>
          </View>
          <View style={styles.calander}>
            <Text>달력</Text>
          </View>
        </View>
        <View style={styles.contentBottom}>
          <Text>시간표</Text>
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
  header: {
    justifyContent: 'center',
    height: '12.5%',
    backgroundColor: 'blue',
  },
  content: {
    flex: 1,
    gap: spacing.md,
    marginVertical: spacing.md,
    backgroundColor: 'gray',
  },
  contentTop: {
    flexDirection: 'row',
    flex: 2,
    gap: spacing.md,
  },
  contentBottom: {
    flex: 3,
    backgroundColor: 'yellow',
  },
  todoList: {
    flex: 2,
    backgroundColor: 'red',
  },
  weather: {
    flex: 1,
    backgroundColor: 'red',
  },
  calander: {
    flex: 1,
    backgroundColor: 'red',
  },
});
