import Flag from '@components/homework/Flag';
import HomeworkItem from '@components/homework/HomeworkItem';
import {borderRadius} from '@theme/borderRadius';
import {spacing} from '@theme/spacing';
import {getResponsiveSize} from '@utils/responsive';
import {useEffect, useState} from 'react';
import {Image, ScrollView, StyleSheet, View} from 'react-native';
import ScreenInfo from '@components/common/ScreenInfo';
import ProgressBoxes from '@components/homework/ProgressBoxes';
// import noteSpringImage from '@assets/images/noteSpring.png';
import notebookImage from '@assets/images/notebook.png';

export type HomeworkType = {
  state: '완료' | '미제출';
  category: string;
  problemNum: number;
  dueToDate: string;
  correct?: boolean;
};

function HomeworkScreen(): React.JSX.Element {
  const flag = [
    {name: '전체', color: '#ffbebe'},
    {name: '국어', color: '#f3ffbe'},
    {name: '수학', color: '#beffe5'},
    {name: '영어', color: '#bedcff'},
    {name: '과학', color: '#ffbeec'},
  ];
  const [selectedFlag, setSelectedFlag] = useState('전체');
  const [homeworkList, setHomeworkList] = useState<HomeworkType[]>([]);

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
      <ScreenInfo title="숙제" />
      <View style={styles.contentContainer}>
        {flag.map((_, index) => (
          <Flag
            key={index}
            color={flag[index].color}
            index={index}
            title={flag[index].name}
            selected={flag[index].name === selectedFlag}
            setSelectedFlag={setSelectedFlag}
          />
        ))}
        <View style={[styles.notebookContainer]}>
          <Image source={notebookImage} style={styles.notebook} />
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
    </View>
  );
}

export default HomeworkScreen;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: spacing.xl,
    paddingLeft: spacing.xxl,
    paddingRight: spacing.xl,
  },
  contentContainer: {
    flexDirection: 'row',
    height: '92%',
  },
  notebook: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    objectFit: 'fill',
  },
  notebookContainer: {
    flexDirection: 'row',
    gap: spacing.xl,
    width: '90%',
    borderBottomEndRadius: borderRadius.sm,
    borderTopEndRadius: borderRadius.sm,
  },
  content: {
    flex: 1,
    gap: spacing.xl,
    padding: spacing.xl,
    paddingRight: spacing.xxl * 1.2,
    paddingLeft: spacing.xxl * 1.6,
  },
  noteSpringImage: {
    marginLeft: -spacing.xxl,
    width: getResponsiveSize(40),
    height: '100%',
    objectFit: 'fill',
  },
  homeworkContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    elevation: getResponsiveSize(2),
    borderRadius: borderRadius.lg,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: spacing.md,
    alignItems: 'center',
  },
});
