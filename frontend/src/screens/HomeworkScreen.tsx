import HomeworkItem from '@components/common/homework/HomeworkItem';
import {Text} from '@components/common/Text';
import {spacing} from '@theme/spacing';
import {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';

export type HomeworkType = {
  state: '완료' | '미제출';
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
        {homeworkList.map((homework, index) => (
          <HomeworkItem key={index} index={index} homework={homework} />
        ))}
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
    marginTop: spacing.xxl,
    gap: spacing.xl,
  },
});
