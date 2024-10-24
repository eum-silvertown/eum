import ExpandableListItem from '@components/common/questionBox/ExpandableListItem';
import {Text} from '@components/common/Text';
import {spacing} from '@theme/spacing';
import {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

type QuestionBoxType = {
  type: 'folder' | 'file';
  parentTitle: string;
  title: string;
  children?: QuestionBoxType[];
};

function QuestionBoxScreen(): React.JSX.Element {
  const [questionBox, setQuestionBox] = useState<QuestionBoxType[]>([]);

  useEffect(() => {
    setQuestionBox([
      {
        type: 'folder',
        parentTitle: '수학',
        title: '다항식의 연산',
        children: [
          {
            type: 'folder',
            parentTitle: '다항식의 연산',
            title: '3번 문제',
            children: [
              {
                type: 'file',
                parentTitle: '3번 문제',
                title: '7번 문제',
              },
            ],
          },
          {
            type: 'file',
            parentTitle: '다항식의 연산',
            title: '11번 문제',
          },
          {
            type: 'file',
            parentTitle: '다항식의 연산',
            title: '12번 문제',
          },
          {
            type: 'file',
            parentTitle: '다항식의 연산',
            title: '15번 문제',
          },
        ],
      },
      {
        type: 'folder',
        parentTitle: '수학',
        title: '나머지 정리의 인수분해',
        children: [
          {
            type: 'file',
            parentTitle: '다항식의 연산',
            title: '3번 문제',
          },
          {
            type: 'file',
            parentTitle: '다항식의 연산',
            title: '11번 문제',
          },
          {
            type: 'file',
            parentTitle: '다항식의 연산',
            title: '12번 문제',
          },
          {
            type: 'file',
            parentTitle: '다항식의 연산',
            title: '15번 문제',
          },
        ],
      },
    ]);
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <Text variant="title" weight="bold">
          문제 보관함
        </Text>
      </View>
      <ScrollView style={styles.questionBoxContainer}>
        {questionBox.map((question, index) => (
          <ExpandableListItem
            key={`${question.title}-${index}`}
            item={question}
          />
        ))}
      </ScrollView>
    </View>
  );
}

export default QuestionBoxScreen;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xxl,
  },
  questionBoxContainer: {
    height: '87.5%',
    marginTop: spacing.xxl,
    overflow: 'scroll',
  },
});
