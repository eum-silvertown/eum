import {Text} from '@components/common/Text';
import {borderRadius} from '@theme/borderRadius';
import {borderWidth} from '@theme/borderWidth';
import {spacing} from '@theme/spacing';
import {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';

type HomeworkType = {
  state: string;
  category: string;
  problemNum: number;
  dueToDate: string;
  correct?: boolean;
};

function HomeworkScreen(): React.JSX.Element {
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
      <View>
        <Text variant="title" weight="bold">
          숙제
        </Text>
      </View>
      <View style={styles.homeworkContainer}>
        {homeworkList.map((homework, index) => {
          return (
            <View style={styles.homeworkItem}>
              <Text style={styles.homeworkIndex}>{index + 1}</Text>
              <Text style={styles.homeworkState}>{homework.state}</Text>
              <View style={styles.homeworkTitle}>
                <Text>
                  {homework.category} - {homework.problemNum}번 문제
                </Text>
                <Text>{homework.dueToDate}</Text>
              </View>
              <Text style={styles.homeworkDday}>D-</Text>
              <Text style={styles.homeworkCorrect}>
                {homework.state === '완료'
                  ? homework.correct
                    ? '정답'
                    : '오답'
                  : '미제출'}
              </Text>
            </View>
          );
        })}
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
  homeworkContainer: {
    marginTop: spacing.xxl * 1.5,
    gap: spacing.xl,
  },
  homeworkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: spacing.md * 1.2,
    paddingHorizontal: spacing.xl,
    borderWidth: borderWidth.sm,
    borderRadius: borderRadius.sm,
    borderStyle: 'solid',
  },
  homeworkIndex: {
    flex: 0.75,
    paddingLeft: spacing.xl,
  },
  homeworkState: {
    flex: 1,
  },
  homeworkTitle: {
    flex: 4,
  },
  homeworkDday: {
    flex: 0.75,
  },
  homeworkCorrect: {
    flex: 0.75,
  },
});
