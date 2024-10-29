import Flag from '@components/homework/Flag';
import HomeworkItem from '@components/homework/HomeworkItem';
import {borderRadius} from '@theme/borderRadius';
import {spacing} from '@theme/spacing';
import {getResponsiveSize} from '@utils/responsive';
import {useEffect, useState} from 'react';
import {Image, ScrollView, StyleSheet, View} from 'react-native';
import ScreenInfo from '@components/common/ScreenInfo';
import ProgressBoxes from '@components/homework/ProgressBoxes';
import noteSpringImage from '@assets/images/noteSpring.png';

export type HomeworkType = {
  state: '완료' | '미제출';
  category: string;
  problemNum: number;
  dueToDate: string;
  correct?: boolean;
};

function HomeworkScreen(): React.JSX.Element {
  const flagColors = ['#FFBEBE', '#F3FFBE', '#BEFFE5', '#BEDCFF', '#FFBEEC'];
  const flagTexts = ['전체', '국어', '영어', '수학', '과학'];
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
        {flagColors.map((_, index) => (
          <Flag
            key={index}
            color={flagColors[index]}
            index={index}
            title={flagTexts[index]}
          />
        ))}
        <View style={[styles.content]}>
          <Image source={noteSpringImage} style={styles.noteSpringImage} />
          <View style={{flex: 1, gap: spacing.xl}}>
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
  content: {
    flexDirection: 'row',
    gap: spacing.xl,
    width: '90%',
    padding: spacing.xl,
    backgroundColor: 'white',
    borderBottomEndRadius: borderRadius.sm,
    borderTopEndRadius: borderRadius.sm,
    elevation: getResponsiveSize(3),
  },
  noteSpringImage: {
    marginLeft: -spacing.xxl,
    width: getResponsiveSize(40),
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
