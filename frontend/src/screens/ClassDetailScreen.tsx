import { View, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
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
  getStudentLectureDetail,
  getTeacherLectureDetail,
  LectureDetailType,
  LectureStudentDetailType,
  LectureTeacherDetailType,
} from 'src/services/lectureInformation';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getResponsiveSize } from '@utils/responsive';
import { useBookModalStore } from '@store/useBookModalStore';
import EmptyData from '@components/common/EmptyData';

type BookLectureProps = {
  lectureId: number,
}

type ClassAverageScores = {
  homeworkAvgScore: number;
  testAvgScore: number;
  attitudeAvgScore: number;
};

function ClassDetailScreen({ lectureId }: BookLectureProps): React.JSX.Element {
  const closeBook = useBookModalStore(state => state.closeBook);

  const isTeacher = false;

  const { data: lectureDetail } = useQuery<LectureDetailType>({
    queryKey: ['lectureDetail', lectureId],
    queryFn: () => getLectureDetail(lectureId),
  });

  const { data: studentLectureDetail } = useQuery<LectureStudentDetailType>({
    queryKey: ['studentLectureDetail', lectureId],
    queryFn: () => getStudentLectureDetail(lectureId),
    enabled: !isTeacher,
  });

  const { data: teacherLectureDetail } = useQuery<LectureTeacherDetailType>({
    queryKey: ['teacherLectureDetail', lectureId],
    queryFn: () => getTeacherLectureDetail(lectureId),
    enabled: isTeacher,
  });

  console.log('lectureDetail', lectureDetail);
  console.log('studentLectureDetail', studentLectureDetail);
  console.log('teacherLectureDetail', teacherLectureDetail);

  const [selectedStudentScores, setSelectedStudentScores] =
    useState<ClassAverageScores | null>(null);
  const [selectedStudentName, setSelectedStudentName] = useState<string | null>(
    null,
  );

  const handleStudentSelect = (scores: ClassAverageScores, name: string) => {
    setSelectedStudentScores(scores);
    setSelectedStudentName(name);
  };

  if (isTeacher) {
    // 선생님용
    return (
      <View style={styles.container}>
        <Pressable onPress={closeBook} style={styles.bookmarkIcon}>
          <BookMarkIcon width={iconSize.xl} height={iconSize.xl} />
        </Pressable>
        <ClassHeader
          isTeacher={isTeacher}
          lectureId={lectureDetail?._id}
          title={lectureDetail?.title}
          subtitle={lectureDetail?.subject}
          schedule={lectureDetail?.schedule}
          semester={lectureDetail?.semester}
          grade={lectureDetail?.grade}
          classNumber={lectureDetail?.classNumber}
          pastTeacherName={lectureDetail?.teacher.name}
          backgroundColor={lectureDetail?.backgroundColor}
          fontColor={lectureDetail?.fontColor}
        />
        <View style={styles.content}>
          <View style={styles.firstRow}>
            <View style={styles.overviewLayout}>
              <Overview
                homeworkCnt={lectureDetail?.homework.length}
                examCnt={lectureDetail?.exams.length}
                lessonCnt={lectureDetail?.lesson.length}
              />
              <Notice
                lectureId={lectureDetail?._id}
                isTeacher={isTeacher}
                notices={lectureDetail?.notices}
              />
            </View>
            <View style={styles.mainContentLayout}>
              <View style={styles.teacherLayout}>
                <Teacher
                  isTeacher={isTeacher}
                  name={lectureDetail?.teacher.name}
                  telephone={lectureDetail?.teacher.telephone}
                  email={lectureDetail?.teacher.email}
                  photo={lectureDetail?.teacher.photo}
                />
              </View>
              <View style={styles.chartLayout}>
                <ClassHandleButtonList />
              </View>
            </View>
          </View>
          <View style={styles.secondRow}>
            <View style={styles.replayLayout}>
              <Replay lesson={lectureDetail?.lesson} />
            </View>
            <View style={styles.homeworkLayout}>
              {teacherLectureDetail ? (
                <>
                  <StudentsChart
                    classAverageScores={
                      selectedStudentScores ||
                      teacherLectureDetail.classAverageScores
                    }
                    studentName={selectedStudentName || '학급 평균'}
                  />
                  <StudentRank
                    studentsInfo={teacherLectureDetail.students}
                    onStudentSelect={handleStudentSelect}
                  />
                </>
              ) : (
                <EmptyData message="학급 정보가 없습니다." />
              )
              }
            </View>
          </View>
        </View>
      </View>
    );
  }

  // 학생용
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={closeBook} style={styles.bookmarkIcon}>
        <BookMarkIcon width={iconSize.xl} height={iconSize.xl} />
      </TouchableOpacity>
      <ClassHeader
        isTeacher={isTeacher}
        lectureId={lectureDetail?._id}
        title={lectureDetail?.title}
        subtitle={lectureDetail?.subject}
        schedule={lectureDetail?.schedule}
        semester={lectureDetail?.semester}
        grade={lectureDetail?.grade}
        backgroundColor={lectureDetail?.backgroundColor}
        fontColor={lectureDetail?.fontColor}
      />
      <View style={styles.content}>
        <View style={styles.firstRow}>
          <View style={styles.overviewLayout}>
            <Overview
              homeworkCnt={lectureDetail?.homework.length}
              examCnt={lectureDetail?.exams.length}
              lessonCnt={lectureDetail?.lesson.length}
            />
            <Notice
              lectureId={lectureDetail?._id}
              isTeacher={isTeacher}
              notices={lectureDetail?.notices}
            />
          </View>
          <View style={styles.mainContentLayout}>
            <View style={styles.teacherLayout}>
              <Teacher
                isTeacher={isTeacher}
                name={lectureDetail?.teacher.name}
                telephone={lectureDetail?.teacher.telephone}
                email={lectureDetail?.teacher.email}
                photo={lectureDetail?.teacher.photo}
              />
            </View>
            <View style={styles.chartLayout}>
              <Chart studentScores={studentLectureDetail?.studentScores} />
            </View>
          </View>
        </View>
        <View style={styles.secondRow}>
          <View style={styles.replayLayout}>
            <Replay lesson={lectureDetail?.lesson} />
          </View>
          <View style={styles.homeworkLayout}>
            <Homework homework={lectureDetail?.homework} />
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
