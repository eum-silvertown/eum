import { Text } from '@components/common/Text';
import { AllAboutHomeworkType, getAllAboutHomework } from '@services/homeworkService';
import { useAuthStore } from '@store/useAuthStore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native';

import HomeworkProgressBox from '@components/homework/HomeworkProgressBox';
import HomeworkList from '@components/homework/HomeworkList';
import { colors } from '@hooks/useColors';
import { detailQuestion, DetailQuestionType } from '@services/questionBox';
import ProblemExSection from '@components/questionBox/ProblemExSection';
import PagerView from 'react-native-pager-view';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenType } from '@store/useCurrentScreenStore';
import { useNavigation } from '@react-navigation/native';

type NavigationProps = NativeStackNavigationProp<ScreenType>;

const HomeworkScreen = (): React.JSX.Element => {
  const navigation = useNavigation<NavigationProps>();
  const { width } = useWindowDimensions();
  const styles = getStyles(width);

  const userId = useAuthStore(state => state.userInfo.id);
  const [allAboutHomework, setAllAboutHomework] = useState<AllAboutHomeworkType>();
  const [selected, setSelected] = useState<'전체 숙제 수' | '완료한 숙제 수' | '미완료'>('전체 숙제 수');
  const [selectedHomework, setSelectedHomework] = useState<number>(0);
  const [questionNumber, setQuestionNumber] = useState<number>(0);
  const [questions, setQuestions] = useState<DetailQuestionType[]>([]);
  const pagerRef = React.useRef<PagerView>(null);

  const handlePrevious = () => {
    if (questionNumber > 0) {
      pagerRef.current?.setPage(questionNumber - 1);
    }
  };

  const handleNext = () => {
    if (questionNumber < questions.length - 1) {
      pagerRef.current?.setPage(questionNumber + 1);
    }
  };

  async function fetchHomework() {
    try {
      const data = await getAllAboutHomework(userId);
      setAllAboutHomework(data);
    } catch (error) {
      console.error('Failed to fetch Homework: ', error);
    }
  }

  useEffect(() => {
    fetchHomework();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedHomework && allAboutHomework) {
      setQuestionNumber(0);

      const selectedHomeworkData = allAboutHomework.homeworkDetails.find(
        homework => homework.homeworkId === selectedHomework
      );

      if (selectedHomeworkData?.questions) {
        Promise.all(
          selectedHomeworkData.questions.map(questionId =>
            detailQuestion(questionId)
          )
        ).then(fetchedQuestions => {
          setQuestions(fetchedQuestions);
        }).catch(error => {
          console.error('Failed to fetch questions:', error);
        });
      } else {
        setQuestions([]);
      }
    } else {
      setQuestions([]);
    }
  }, [selectedHomework, allAboutHomework]);

  const handlePageSelected = (e: any) => {
    setQuestionNumber(e.nativeEvent.position);
  };

  if (!allAboutHomework) {
    return <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <View style={{ gap: width * 0.01 }}>
        <ActivityIndicator />
        <Text>데이터를 불러오고 있습니다...</Text>
      </View>
    </View>;
  }

  const getFilteredHomeworkList = () => {
    switch (selected) {
      case '전체 숙제 수':
        return allAboutHomework.homeworkDetails;
      case '완료한 숙제 수':
        return allAboutHomework.homeworkDetails.filter(homework => homework.isComplete);
      case '미완료':
        return allAboutHomework.homeworkDetails.filter(homework => !homework.isComplete);
      default:
        return allAboutHomework.homeworkDetails;
    }
  };

  return <View style={styles.container}>
    <View style={styles.progressView}>
      <Text variant="subtitle" weight="bold">숙제 진행도</Text>
      <View style={styles.progressBoxes}>
        <HomeworkProgressBox
          value={allAboutHomework.totalHomeworkCount}
          variant="전체 숙제 수"
          selected={selected}
          setSelected={setSelected}
        />
        <HomeworkProgressBox
          value={allAboutHomework.completedHomeworkCount}
          variant="완료한 숙제 수"
          selected={selected}
          setSelected={setSelected}
        />
        <HomeworkProgressBox
          value={allAboutHomework.totalHomeworkCount - allAboutHomework.completedHomeworkCount}
          variant="미완료"
          selected={selected}
          setSelected={setSelected}
        />
        <HomeworkProgressBox
          value={Math.floor(allAboutHomework.averageScore)}
          variant="평균 점수"
        />
      </View>
    </View>
    <View style={styles.homeworkView}>
      <HomeworkList homeworkList={getFilteredHomeworkList()} selectedHomework={selectedHomework} setSelectedHomework={setSelectedHomework} />
      <View style={styles.previewView}>
        <Text variant="subtitle" weight="bold">숙제 미리보기</Text>
        <View style={[styles.preview, !selectedHomework && styles.previewEmpty]}>
          {selectedHomework ? (
            <View style={{ flex: 1 }}>
              <View style={styles.previewHeader}>
                <Text variant="subtitle">문제 {questionNumber + 1} / {questions.length}</Text>
                <View style={styles.navigationButtons}>
                  <TouchableOpacity
                    onPress={handlePrevious}
                    disabled={questionNumber === 0}
                    style={[styles.navButton, questionNumber === 0 && styles.navButtonDisabled]}
                  >
                    <Text color={questionNumber === 0 ? undefined : 'white'}>이전</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleNext}
                    disabled={questionNumber === questions.length - 1}
                    style={[styles.navButton, questionNumber === questions.length - 1 && styles.navButtonDisabled]}
                  >
                    <Text color={questionNumber === questions.length - 1 ? undefined : 'white'}>다음</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <PagerView
                ref={pagerRef}
                style={{ flex: 1 }}
                initialPage={0}
                onPageSelected={handlePageSelected}>
                {questions.map((question, index) => (
                  <View key={index} style={{ flex: 1 }}>
                    <ProblemExSection
                      fontSize={width * 0.009}
                      problemText={question.content}
                      isVisible={Math.abs(index - questionNumber) <= 1}
                    />
                  </View>
                ))}
              </PagerView>
              <Pressable
                style={({ pressed }) => [
                  styles.navButton,
                  pressed && styles.navButtonPressed,
                ]}
                onPress={() => {
                  const homework = allAboutHomework.homeworkDetails.find(
                    hw => hw.homeworkId === selectedHomework
                  );

                  if (!homework) {
                    Alert.alert('오류', '선택된 숙제를 찾을 수 없습니다.');
                    return;
                  }

                  if (homework.isComplete) {
                    // 제출된 숙제 -> 결과 화면으로 이동
                    navigation.navigate('ConfirmSolvedScreen', {
                      typeId: homework.homeworkId,
                      questionIds: homework.questions,
                      solvedType: 'HOMEWORK',
                    });
                  } else if (homework.endTime && new Date() <= new Date(homework.endTime)) {
                    // 기한 내 미제출 -> 숙제 풀이 화면으로 이동
                    navigation.navigate('SolveHomeworkScreen', {
                      homeworkId: homework.homeworkId,
                      questionIds: homework.questions,
                    });
                  } else {
                    // 기한 지난 미제출 -> 알림
                    Alert.alert('알림', '기한이 지난 숙제는 제출할 수 없습니다.');
                  }
                }}>
                <Text color='white'>문제 풀기</Text>
              </Pressable>
            </View>
          ) : (
            <Text>파일을 터치하면 문제를 미리볼 수 있습니다.</Text>
          )}
        </View>
      </View>
    </View>
  </View>;
};

export default HomeworkScreen;

function getStyles(width: number) {
  return StyleSheet.create({
    container: {
      flex: 1,
      gap: width * 0.01,
      padding: width * 0.025,
      backgroundColor: '#f0f0f0',
    },
    leftContentView: {
      flex: 1,
      gap: width * 0.01,
    },
    rightContentView: {
      flex: 1,
    },
    progressView: {
      flex: 2,
      gap: width * 0.01,
    },
    progressBoxes: {
      flex: 1,
      flexDirection: 'row',
      gap: width * 0.025,
    },
    homeworkView: {
      flex: 6.5,
      flexDirection: 'row',
      gap: width * 0.025,
    },
    previewView: {
      flex: 4, gap: width * 0.01,
    },
    preview: {
      flex: 1,
      paddingTop: width * 0.01,
      paddingBottom: width * 0.005,
      paddingHorizontal: width * 0.01,
      backgroundColor: 'white',
      borderWidth: width * 0.001,
      borderRadius: width * 0.01,
      borderColor: colors.light.borderColor.pickerBorder,
    },
    previewEmpty: {
      justifyContent: 'center',
      alignItems: 'center',
    }, previewHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: width * 0.01,
    },
    navigationButtons: {
      flexDirection: 'row',
      gap: width * 0.01,
    },
    navButton: {
      paddingVertical: width * 0.005,
      paddingHorizontal: width * 0.01,
      backgroundColor: colors.light.background.main,
      borderRadius: width * 0.005,
    },
    navButtonPressed: {
      backgroundColor: colors.light.background.mainPressed,
    },
    navButtonDisabled: {
      backgroundColor: colors.light.borderColor.pickerBorder,
    },
  });
}
