import { Text } from '@components/common/Text';
import { AllAboutHomeworkType, getAllAboutHomework } from '@services/homeworkService';
import { useAuthStore } from '@store/useAuthStore';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import HomeworkProgressBox from '@components/homework/HomeworkProgressBox';
import HomeworkList from '@components/homework/HomeworkList';
import { colors } from 'src/hooks/useColors';
import { detailQuestion, DetailQuestionType } from '@services/questionBox';
import { useQuery } from '@tanstack/react-query';
import ProblemExSection from '@components/questionBox/ProblemExSection';

const HomeworkScreen = (): React.JSX.Element => {
  const { width } = useWindowDimensions();
  const styles = getStyles(width);

  const userId = useAuthStore(state => state.userInfo.id);
  const [allAboutHomework, setAllAboutHomework] = useState<AllAboutHomeworkType>();
  const [selected, setSelected] = useState<'전체 숙제 수' | '완료한 숙제 수' | '미완료'>('전체 숙제 수');
  const [selectedHomework, setSelectedHomework] = useState<number>(0);
  const {data: selectedHomeworkDetail} = useQuery<DetailQuestionType>({
    queryKey: ['selectedHomeworkDetail', selectedHomework],
    queryFn: () => detailQuestion(selectedHomework),
    enabled: selectedHomework !== 0,
  });

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

  if (!allAboutHomework) {
    return <View><Text>Loading...</Text></View>;
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
      <HomeworkList homeworkList={getFilteredHomeworkList()} selectedHomework={selectedHomework} setSelectedHomework={setSelectedHomework}/>
      <View style={styles.previewView}>
        <Text variant="subtitle" weight="bold">숙제 미리보기</Text>
        <View style={[styles.preview, !selectedHomeworkDetail && styles.previewEmpty]}>
          {selectedHomeworkDetail
            ? <ProblemExSection fontSize={width * 0.009} problemText={selectedHomeworkDetail.content}/>
            : <Text>파일을 터치하면 문제를 미리볼 수 있습니다.</Text>}
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
    },
  });
}
