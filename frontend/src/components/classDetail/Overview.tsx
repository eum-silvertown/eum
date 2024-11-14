import React from 'react';
import {Text} from '@components/common/Text';
import {View, StyleSheet} from 'react-native';
import ProgressBox from '@components/homework/ProgressBox';
import {getResponsiveSize} from '@utils/responsive';
import {
  HomeworkType,
  ExamType,
  LessonType,
} from 'src/services/lectureInformation';

type OverviewProps = {
  homeworkCnt?: number;
  examCnt?: number;
  lessonCnt?: number;
  navigateData?: {
    lessons: LessonType[];
    exams: ExamType[];
    homeworks: HomeworkType[];
  };
};

function Overview({
  homeworkCnt = 0,
  examCnt = 0,
  lessonCnt = 0,
  navigateData = {lessons: [], exams: [], homeworks: []},
}: OverviewProps): React.JSX.Element {
  return (
    <View style={styles.overview}>
      <Text variant="subtitle" weight="bold" style={styles.subtitle}>
        Overview
      </Text>
      <View style={styles.progressLayout}>
        <ProgressBox
          color="green"
          title="수업"
          content={`${lessonCnt}`}
          unit="번"
          icon="folderCheck"
          isLessonDetail={true}
          navigateData={navigateData.lessons}
        />
        <ProgressBox
          color="red"
          title="시험"
          content={`${examCnt}`}
          unit="번"
          icon="complete"
          isLessonDetail={true}
          navigateData={navigateData.exams}
        />
        <ProgressBox
          color="blue"
          title="숙제"
          content={`${homeworkCnt}`}
          unit="개"
          icon="homeworkCheck"
          isLessonDetail={true}
          navigateData={navigateData.homeworks}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overview: {
    flex: 1,
    gap: 10,
  },
  subtitle: {
    marginStart: 25,
  },
  progressLayout: {
    flex: 1,
    flexDirection: 'row',
    gap: 40,
    paddingHorizontal: getResponsiveSize(32),
  },
});

export default Overview;
