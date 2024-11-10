import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { spacing } from '@theme/spacing';
import Chart from '@components/classDetail/Chart';
import ClassHeader from '@components/classDetail/ClassHeader';
import Homework from '@components/classDetail/Homework';
import Notice from '@components/classDetail/Notice';
import Overview from '@components/classDetail/Overview';
import Replay from '@components/classDetail/Replay';
import Teacher from '@components/classDetail/Teacher';
import StudentRank from '@components/classDetail/StudentRank';
import StudentsChart from '@components/classDetail/StudentsChart';
import ClassHandleButtonList from '@components/classDetail/ClassHandleButtonList';
import { iconSize } from '@theme/iconSize';
import BookMarkIcon from '@assets/icons/bookMarkIcon.svg';
import {
  getLectureDetail,
  LectureDetailType,
  ClassAverageScoresType,
} from 'src/services/lectureInformation';
import { useQuery } from '@tanstack/react-query';
import { getResponsiveSize } from '@utils/responsive';
import { useBookModalStore } from '@store/useBookModalStore';
import EmptyData from '@components/common/EmptyData';
import { useAuthStore } from '@store/useAuthStore';

type BookLectureProps = {
  lectureId: number;
};

function ClassDetailScreen({ lectureId }: BookLectureProps): React.JSX.Element {
  const closeBook = useBookModalStore(state => state.closeBook);
  const userInfo = useAuthStore(state => state.userInfo);
  const isTeacher = userInfo.role === 'TEACHER';

  // 통합 강의 상세 정보 쿼리
  const { data: lectureDetail, isLoading, isError } = useQuery<LectureDetailType>({
    queryKey: ['lectureDetail', lectureId],
    queryFn: () => getLectureDetail(lectureId),
  });

  const [selectedStudentScores, setSelectedStudentScores] = useState<ClassAverageScoresType | null>(null);
  const [selectedStudentName, setSelectedStudentName] = useState<string | null>(null);

  const handleStudentSelect = (scores: ClassAverageScoresType, name: string) => {
    setSelectedStudentScores(scores);
    setSelectedStudentName(name);
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (isError || !lectureDetail) {
    return <EmptyData message="강의 정보를 불러올 수 없습니다." />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={closeBook} style={styles.bookmarkIcon}>
        <BookMarkIcon width={iconSize.xl} height={iconSize.xl} />
      </TouchableOpacity>
      <ClassHeader
        isTeacher={isTeacher}
        lectureId={lectureDetail.lectureId}
        title={lectureDetail.title}
        subtitle={lectureDetail.subject}
        schedule={lectureDetail.schedule}
        semester={lectureDetail.semester}
        grade={lectureDetail.grade}
        classNumber={lectureDetail.classNumber}
        backgroundColor={lectureDetail.backgroundColor}
        fontColor={lectureDetail.fontColor}
        pastTeacherName={lectureDetail.teacherModel.name}
      />
      <View style={styles.content}>
        <View style={styles.firstRow}>
          <View style={styles.overviewLayout}>
            <Overview
              homeworkCnt={lectureDetail.homeworks.length}
              examCnt={lectureDetail.exams.length}
              lessonCnt={lectureDetail.lessons.length}
            />
            <Notice
              lectureId={lectureDetail.lectureId}
              isTeacher={isTeacher}
              notices={lectureDetail.notices}
            />
          </View>
          <View style={styles.mainContentLayout}>
            <View style={styles.teacherLayout}>
              <Teacher
                isTeacher={isTeacher}
                name={lectureDetail.teacherModel.name}
                telephone={lectureDetail.teacherModel.tel}
                email={lectureDetail.teacherModel.email}
                photo={lectureDetail.teacherModel.image}
              />
            </View>
            <View style={styles.chartLayout}>
              {isTeacher ? (
                <ClassHandleButtonList />
              ) : (
                <Chart studentScores={lectureDetail.studentOverviewModel?.studentScores} />
              )}
            </View>
          </View>
        </View>
        <View style={styles.secondRow}>
          <View style={styles.replayLayout}>
            <Replay lesson={lectureDetail.lessons} />
          </View>
          <View style={styles.homeworkLayout}>
            {isTeacher ? (
              <>
                <StudentsChart
                  classAverageScores={
                    selectedStudentScores || lectureDetail.teacherOverviewModel?.classAverageScores
                  }
                  studentName={selectedStudentName || '학급 평균'}
                />
                <StudentRank
                  studentsInfo={lectureDetail.teacherOverviewModel?.students}
                  onStudentSelect={handleStudentSelect}
                />
              </>
            ) : (
              <Homework homework={lectureDetail.homeworks} />
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    position: 'relative',
  },
  bookmarkIcon: {
    position: 'absolute',
    top: getResponsiveSize(-6),
    right: getResponsiveSize(12),
  },
  content: {
    flex: 1,
    gap: spacing.md,
  },
  firstRow: {
    flex: 6,
    flexDirection: 'row',
    gap: spacing.md,
  },
  secondRow: {
    flex: 4,
    flexDirection: 'row',
    gap: spacing.md,
  },
  overviewLayout: {
    flex: 2,
    flexDirection: 'column',
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: '#fafaff',
    borderRadius: 8,
  },
  mainContentLayout: {
    flex: 1,
    gap: spacing.md,
  },
  teacherLayout: {
    flex: 1,
    backgroundColor: '#fafaff',
    borderRadius: 8,
  },
  chartLayout: {
    flex: 1,
    backgroundColor: '#fafaff',
    borderRadius: 8,
  },
  replayLayout: {
    flex: 2,
    backgroundColor: '#fafaff',
    borderRadius: 8,
  },
  homeworkLayout: {
    flex: 1,
    backgroundColor: '#fafaff',
    borderRadius: 8,
  },
});

export default ClassDetailScreen;
