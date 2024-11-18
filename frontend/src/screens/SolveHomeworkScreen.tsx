import {View, StyleSheet, Text} from 'react-native';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {useCurrentScreenStore} from '@store/useCurrentScreenStore';
import ProblemSection from '@components/common/ProblemSection';
import StudentCanvasSection from '@components/classActivity/StudentHomeworkCanvasSection';
import {useQuery} from '@tanstack/react-query';
import {getFileDetail} from '@services/problemService';
import {useState} from 'react';

function SolveHomeworkScreen(): React.JSX.Element {
  const setCurrentScreen = useCurrentScreenStore(
    state => state.setCurrentScreen,
  );
  const route = useRoute();
  const {homeworkId, questionIds} = route.params as {
    homeworkId: number;
    questionIds: number[];
  };
  const [currentPage, setCurrentPage] = useState(1);
  useFocusEffect(() => {
    setCurrentScreen('SolveHomeworkScreen');
  });

  const {
    data: problems,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['homeworkProblems', questionIds],
    queryFn: async ({queryKey}) => {
      const [, responseQuestionIds] = queryKey;
      const problemDetails = await Promise.all(
        (responseQuestionIds as number[]).map(questionId =>
          getFileDetail(questionId),
        ),
      );
      return problemDetails;
    },
    enabled: !!questionIds.length,
  });

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError || !problems) {
    return <Text>Error loading problems.</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.sectionContainer}>
        <View style={{marginLeft: '15%', marginTop: '5%'}}>
          <ProblemSection problemText={problems[currentPage - 1].content} />
        </View>
        <StudentCanvasSection
          solveType="HOMEWORK"
          homeworkId={homeworkId}
          questionIds={questionIds}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          problemsCnt={problems.length}
          problems={problems}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  sectionContainer: {
    flex: 1,
    padding: 16,
    position: 'relative',
  },
});

export default SolveHomeworkScreen;
