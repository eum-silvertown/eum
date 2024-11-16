import Flag from '@components/homework/Flag';
import HomeworkItem from '@components/homework/HomeworkItem';
import {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import ProgressBoxes from '@components/homework/ProgressBoxes';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {getAllAboutHomework} from '@services/homeworkService';
import {useAuthStore} from '@store/useAuthStore';

export type HomeworkType = {
  state: '완료' | '미제출';
  category: string;
  problemNum: number;
  dueToDate: string;
  correct?: boolean;
};

function HomeworkScreen(): React.JSX.Element {
  const userId = useAuthStore(state => state.userInfo.id);
  const flag = [
    {name: '전체', color: '#ffbebe'},
    {name: '국어', color: '#f3ffbe'},
    {name: '수학', color: '#beffe5'},
    {name: '영어', color: '#bedcff'},
    {name: '과학', color: '#ffbeec'},
  ];
  const [selectedFlag, setSelectedFlag] = useState(0);
  const [homeworkList, setHomeworkList] = useState<HomeworkType[]>([]);

  const left = useSharedValue(0);
  const selectedAnimatedStyles = useAnimatedStyle(() => ({
    left: `${left.value}%`,
  }));

  async function fetchHomework() {
    try {
      await getAllAboutHomework(userId);
    } catch (error) {
      console.error('Failed to fetch Homework: ', error);
    }
  }

  useEffect(() => {
    fetchHomework();
  }, []);

  useEffect(() => {
    left.value = withTiming(selectedFlag * 10, {duration: 300});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFlag]);

  useEffect(() => {
    setHomeworkList([
      {
        state: '완료',
        category: '다항식의 연산',
        problemNum: 3,
        dueToDate: '2024.11.23',
        correct: true,
      },
      {
        state: '미제출',
        category: '다항식의 연산',
        problemNum: 3,
        dueToDate: '2024.11.23',
      },
      {
        state: '완료',
        category: '다항식의 연산',
        problemNum: 3,
        dueToDate: '2024.11.23',
        correct: false,
      },
      {
        state: '완료',
        category: '다항식의 연산',
        problemNum: 3,
        dueToDate: '2024.11.23',
        correct: true,
      },
      {
        state: '완료',
        category: '다항식의 연산',
        problemNum: 3,
        dueToDate: '2024.11.23',
        correct: true,
      },
      {
        state: '완료',
        category: '다항식의 연산',
        problemNum: 3,
        dueToDate: '2024.11.23',
        correct: true,
      },
    ]);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.flagsContainer}>
        <Animated.View style={[selectedAnimatedStyles, styles.flags]} />
        {flag.map((_, index) => (
          <Flag
            key={index}
            index={index}
            title={flag[index].name}
            setSelectedFlag={setSelectedFlag}
          />
        ))}
      </View>
      <View style={[styles.notebookContainer]}>
        {/* <Image source={noteSpringImage} style={styles.noteSpringImage} /> */}
        <View style={styles.content}>
          <ProgressBoxes />
          <View style={styles.homeworkContainer}>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollViewContent}>
              {homeworkList.map((homework, index) => (
                <HomeworkItem key={index} homework={homework} />
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    </View>
  );
}

export default HomeworkScreen;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    gap: 15,
    padding: 15,
    borderRadius: 15,
  },
  flagsContainer: {
    flexDirection: 'row',
    height: '10%',
    borderRadius: 15,
    backgroundColor: 'white',
    overflow: 'hidden',
    elevation: 2,
  },
  flags: {
    position: 'absolute',
    width: '10%',
    height: '100%',
    backgroundColor: 'yellow',
    borderRadius: 15,
  },
  notebook: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    objectFit: 'fill',
  },
  notebookContainer: {
    flex: 1,
    flexDirection: 'row',
    borderBottomEndRadius: 5,
    borderTopEndRadius: 5,
  },
  content: {
    flex: 1,
    gap: 15,
  },
  homeworkContainer: {
    flex: 1,
    backgroundColor: 'white',
    elevation: 2,
    borderRadius: 15,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 10,
    alignItems: 'center',
  },
});
