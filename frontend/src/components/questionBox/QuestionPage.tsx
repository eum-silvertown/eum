import Button from '@components/common/Button';
import { Text } from '@components/common/Text';
import { borderRadius } from '@theme/borderRadius';
import { borderWidth } from '@theme/borderWidth';
import { iconSize } from '@theme/iconSize';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, useWindowDimensions, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { colors } from 'src/hooks/useColors';
import ProblemExSection from './ProblemExSection';
import BackArrowIcon from '@assets/icons/backArrowIcon.svg';

interface QuestionsPageProps {
  questions: string[];
  questionNumber: number;
  pagerRef: React.RefObject<PagerView>;
  onPageSelected: (e: any) => void;
  onSelectedDone: (selections: number[], answers: string[]) => void;
}

function QuestionsPage({
  questions,
  questionNumber,
  pagerRef,
  onPageSelected,
  onSelectedDone,
}: QuestionsPageProps): React.JSX.Element {
  const { width } = useWindowDimensions();
  const styles = getStyles(width);

  const [selections, setSelections] = useState<number[]>([]);
  const [answers, setAnswers] = useState<string[]>(new Array(questions.length).fill(''));

  const toggleSelection = (index: number) => {
    setSelections(prev => {
      if (prev.includes(index)) {
        return prev.filter(item => item !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const isSelected = (index: number) => selections.includes(index);

  const handleAnswerChange = (text: string, index: number) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[index] = text;
      return newAnswers;
    });
  };

  const handlePageChange = (targetPage: number) => {
    if (isSelected(questionNumber) && !answers[questionNumber]) {
      Alert.alert('선택된 문제의 답을 입력해주세요.');
      return;
    }
    pagerRef.current?.setPage(targetPage);
  };

  const handleSelectedDone = () => {
    const unansweredSelections = selections.filter(index => !answers[index]);
    if (unansweredSelections.length > 0) {
      Alert.alert('경고', '선택된 문제 중 답이 입력되지 않은 문제가 있습니다.');
      return;
    }
    onSelectedDone(selections, answers);
  };

  const shouldRenderPage = (index: number) => {
    return Math.abs(index - questionNumber) <= 1;
  };

  return (
    <View style={styles.pageContent}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text variant='subtitle'>문제 {`${questionNumber + 1} / ${questions.length}`}</Text>
        <Text>선택된 문제 수 : {selections.length}</Text>
      </View>
      <View style={[
        styles.questionContainer,
        { borderWidth: width * 0.001, borderRadius: width * 0.005 },
        isSelected(questionNumber) && styles.selectedQuestion
      ]}>
        <PagerView
          style={styles.pagerView}
          initialPage={0}
          ref={pagerRef}
          onPageSelected={onPageSelected}>
          {questions.map((question, index) => (
            <Pressable
              key={index}
              style={styles.pageContainer}
              onPress={() => toggleSelection(index)}>
              <ProblemExSection
                problemText={question}
                fontSize={width * 0.009}
                isVisible={shouldRenderPage(index)}
              />
            </Pressable>
          ))}
        </PagerView>
        {questionNumber > 0 && (
          <Pressable
            style={styles.prevButton}
            onPress={() => handlePageChange(questionNumber - 1)}>
            <BackArrowIcon width={width * 0.0125} height={width * 0.0125} />
          </Pressable>
        )}
        {questionNumber < questions.length - 1 && (
          <Pressable
            style={styles.nextButton}
            onPress={() => handlePageChange(questionNumber + 1)}>
            <BackArrowIcon width={width * 0.0125} height={width * 0.0125} style={{ transform: [{ rotate: '180deg' }] }} />
          </Pressable>
        )}
      </View>
      <View style={{ flex: 1, gap: width * 0.005 }}>
        <Text variant='subtitle'>답 : {answers[questionNumber]}</Text>
        <View style={styles.answerContainer}>
          <TextInput
            style={{ flex: 1, borderWidth: width * 0.001, borderRadius: width * 0.005, paddingHorizontal: width * 0.0125 }}
            placeholder='답을 입력해주세요.'
            maxLength={50}
            value={answers[questionNumber]}
            onChangeText={(text) => handleAnswerChange(text, questionNumber)}
          />
          <Button
            onPress={handleSelectedDone}
            content="선택 완료"
            size="sm"
            variant="pressable"
          />
        </View>

      </View>

    </View>
  );
}

const getStyles = (width: number) => StyleSheet.create({
  pageContent: {
    flex: 1,
    padding: width * 0.015,
    gap: width * 0.01,
  },
  questionContainer: {
    width: '100%',
    height: '60%',
  },
  pagerView: {
    width: '100%',
    height: '100%',
  },
  pageContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },
  checkCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: borderWidth.sm,
    borderRadius: 9999,
    width: iconSize.md,
    height: iconSize.md,
  },
  checkInnerCircle: {
    width: iconSize.sm,
    height: iconSize.sm,
    borderRadius: 9999,
  },
  selectedCircle: {
    backgroundColor: colors.light.text.success,
  },
  questionCard: {
    flex: 1,
    borderRadius: borderRadius.lg,
  },
  prevButton: {
    position: 'absolute',
    left: width * 0.0125,
    top: '50%',
    width: width * 0.025,
    height: width * 0.025,
  },
  nextButton: {
    position: 'absolute',
    right: width * 0.0125,
    top: '50%',
    width: width * 0.025,
    height: width * 0.025,
  },
  answerContainer: {
    flexDirection: 'row',
    gap: width * 0.0125,
  },
  selectedQuestion: {
    borderColor: colors.light.text.success,
  },
});

export default QuestionsPage;
