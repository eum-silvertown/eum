import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
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
import { useLectureStore, useLessonStore } from '@store/useLessonStore';

type BookLectureProps = {
  lectureId: number;
};

function ClassDetailScreen({ lectureId }: BookLectureProps): React.JSX.Element {
  const closeBook = useBookModalStore(state => state.closeBook);
  const userInfo = useAuthStore(state => state.userInfo);
  const isTeacher = userInfo.role === 'TEACHER';
  const setLectureInfo = useLectureStore(state => state.setLectureInfo);
  const setLectureId = useLessonStore(state => state.setLectureId);
  const setLessonInfo = useLessonStore(state => state.setLessonInfo);

  // 통합 강의 상세 정보 쿼리
  const {
    data: lectureDetail,
    isLoading,
    isError,
  } = useQuery<LectureDetailType>({
    queryKey: ['lectureDetail', lectureId],
    queryFn: () => getLectureDetail(lectureId),
  });

  // zustand에 필요한 값 저장
  useEffect(() => {
    if (lectureDetail) {
      setLectureInfo(userInfo.id, lectureDetail.teacherModel.teacherId);
      setLectureId(lectureId);
      if (lectureDetail.lectureStatus) {
        console.log(
          lectureDetail.lessons[lectureDetail.lessons.length - 1].lessonId,
        );
        console.log(
          lectureDetail.lessons[lectureDetail.lessons.length - 1].questions,
        );
        setLessonInfo(
          lectureDetail.lessons[lectureDetail.lessons.length - 1].lessonId,
          lectureDetail.lessons[lectureDetail.lessons.length - 1].questions,
        );
      }
    }
  }, [
    lectureDetail,
    lectureId,
    setLectureId,
    setLectureInfo,
    setLessonInfo,
    userInfo.id,
  ]);

  const [selectedStudentScores, setSelectedStudentScores] =
    useState<ClassAverageScoresType | null>(null);
  const [selectedStudentName, setSelectedStudentName] = useState<string | null>(
    null,
  );

  const handleStudentSelect = (
    scores: ClassAverageScoresType,
    name: string,
  ) => {
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
        lectureStatus={lectureDetail.lectureStatus}
      />
      <View style={styles.content}>
        <View style={styles.firstRow}>
          <View style={styles.overviewLayout}>
            <Overview
              homeworkCnt={lectureDetail.homeworks.length}
              examCnt={lectureDetail.exams.length}
              lessonCnt={lectureDetail.lessons.length}
              navigateData={{
                lessons: lectureDetail.lessons,
                exams: lectureDetail.exams,
                homeworks: lectureDetail.homeworks,
              }}
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
                <ClassHandleButtonList
                  lectureId={lectureDetail.lectureId}
                  lectureStatus={lectureDetail.lectureStatus}
                />
              ) : (
                <Chart
                  studentScores={
                    lectureDetail.studentOverviewModel?.studentScores
                  }
                />
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
                    selectedStudentScores ||
                    lectureDetail.teacherOverviewModel?.classAverageScores
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
    paddingHorizontal: 25,
    paddingVertical: 15,
    position: 'relative',
  },
  bookmarkIcon: {
    position: 'absolute',
    top: getResponsiveSize(-9),
    right: getResponsiveSize(18),
  },
  content: {
    flex: 1,
    gap: 10,
  },
  firstRow: {
    flex: 6,
    flexDirection: 'row',
    gap: 10,
  },
  secondRow: {
    flex: 4,
    flexDirection: 'row',
    gap: 10,
  },
  overviewLayout: {
    flex: 2,
    flexDirection: 'column',
    paddingTop: 10,
    paddingBottom: 25,
    backgroundColor: '#fafaff',
    borderRadius: 8,
  },
  mainContentLayout: {
    flex: 1,
    gap: 10,
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
