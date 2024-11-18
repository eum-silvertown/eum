import {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {useCurrentScreenStore} from '@store/useCurrentScreenStore';
import ProblemSection from '@components/common/ProblemSection';
import StudentExamCanvasSection from '@components/classActivity/StudentExamCanvasSection';
import {useQuery} from '@tanstack/react-query';
import {getFileDetail} from '@services/problemService';
import {useExamStore} from '@store/useExamStore';

function SolveExamScreen(): React.JSX.Element {
  const setCurrentScreen = useCurrentScreenStore(
    state => state.setCurrentScreen,
  );
  const route = useRoute();
  const {examId, questionIds} = route.params as {
    examId: number;
    questionIds: number[];
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  useFocusEffect(() => {
    setCurrentScreen('SolveExamScreen');
  });
  const {exams} = useExamStore();
  const {
    data: problems,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['examProblems', questionIds],
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

  useEffect(() => {
    const exam = exams.find(e => e.examId === examId);
    if (exam) {
      const endTime = new Date(exam.endTime).getTime();
      const interval = setInterval(() => {
        const now = Date.now();
        const timeLeft = Math.max(0, endTime - now);
        setRemainingTime(timeLeft);

        if (timeLeft === 0) {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [examId, exams]);

  const formatTime = (time: number) => {
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    const seconds = Math.floor((time / 1000) % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    const minutesLeft = remainingTime / (1000 * 60);
    if (minutesLeft <= 5) {
      return 'red';
    }
    if (minutesLeft <= 10) {
      return 'orange';
    }
    return 'green';
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError || !problems) {
    return <Text>Error loading problems.</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.sectionContainer}>
        <Text style={[styles.timerText, {color: getTimeColor()}]}>
          남은 시간: {formatTime(remainingTime)}
        </Text>
        <View style={{marginLeft: '15%', marginTop: '5%'}}>
          <ProblemSection problemText={problems[currentPage - 1].content} />
        </View>
        <StudentExamCanvasSection
          solveType="EXAM"
          examId={examId}
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
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SolveExamScreen;
