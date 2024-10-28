import Flag from '@components/homework/Flag';
import HomeworkItem from '@components/homework/HomeworkItem';
import ProgressChart from '@components/homework/ProgressChart';
import {Text} from '@components/common/Text';
import {borderRadius} from '@theme/borderRadius';
import {spacing} from '@theme/spacing';
import {getResponsiveSize} from '@utils/responsive';
import {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import ScreenInfo from '@components/common/ScreenInfo';
import ProgressBoxes from '@components/homework/ProgressBoxes';

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
        dueToDate: '2024.10.23',
        correct: true,
      },
      {
        state: '미제출',
        category: '다항식의 연산',
        problemNum: 3,
        dueToDate: '2024.10.23',
      },
      {
        state: '완료',
        category: '다항식의 연산',
        problemNum: 3,
        dueToDate: '2024.10.23',
        correct: false,
      },
      {
        state: '완료',
        category: '다항식의 연산',
        problemNum: 3,
        dueToDate: '2024.10.23',
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
          <View style={{flex: 1, gap: spacing.lg}}>
            <ProgressBoxes />
            <View style={{flexDirection: 'row', gap: spacing.lg}}>
              <View style={styles.progressChart}>
                <Text variant="subtitle" weight="medium">
                  진행도
                </Text>
                <ProgressChart />
              </View>
              <View style={styles.homeworkContainer}>
                {homeworkList.map((homework, index) => (
                  <HomeworkItem key={index} homework={homework} />
                ))}
              </View>
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
    paddingHorizontal: spacing.xxl,
  },
  contentContainer: {
    flexDirection: 'row',
    height: '89%',
  },
  content: {
    flexDirection: 'row',
    gap: spacing.xl,
    left: '12.5%',
    width: '87.5%',
    padding: spacing.xl,
    backgroundColor: 'white',
    borderBottomEndRadius: borderRadius.sm,
    borderTopEndRadius: borderRadius.sm,
    elevation: getResponsiveSize(3),
  },
  progressChart: {
    width: '32%',
    height: '98.5%',
    padding: spacing.lg,
    backgroundColor: 'white',
    borderRadius: borderRadius.lg,
    elevation: getResponsiveSize(2),
  },
  homeworkContainer: {
    flex: 1,
    alignItems: 'center',
    height: '98.5%',
    backgroundColor: 'white',
    elevation: getResponsiveSize(2),
    borderRadius: borderRadius.lg,
  },
});
