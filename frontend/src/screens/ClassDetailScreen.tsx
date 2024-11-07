import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {spacing} from '@theme/spacing';
import Chart from '@components/classDetail/Chart';
import ClassHeader from '@components/classDetail/ClassHeader';
import Homework from '@components/classDetail/Homework';
import Notice from '@components/classDetail/Notice';
import Overview from '@components/classDetail/Overview';
import Replay from '@components/classDetail/Replay';
import Teacher from '@components/classDetail/Teacher';
import OverviewForTeacher from '@components/classDetail/OverviewForTeacher';

import ClassHandleButtonList from '@components/classDetail/ClassHandleButtonList';
import {iconSize} from '@theme/iconSize';
import BookMarkIcon from '@assets/icons/bookMarkIcon.svg';
import {
  getLectureDetail,
  getStudentLectureDetail,
  getTeacherLectureDetail,
  LectureDetailType,
  LectureStudentDetailType,
  LectureTeacherDetailType,
} from 'src/services/lectureInformation';
import {useQuery} from '@tanstack/react-query';
import {useCurrentScreenStore} from '@store/useCurrentScreenStore';
import {useFocusEffect} from '@react-navigation/native';

interface ClassDetailScreenProp {
  closeBook: () => void;
}

function ClassDetailScreen({
  closeBook,
}: ClassDetailScreenProp): React.JSX.Element {
  const setCurrentScreen = useCurrentScreenStore(
    state => state.setCurrentScreen,
  );

  useFocusEffect(() => {
    setCurrentScreen('ClassDetailScreen');
  });

  const lectureId = 1;
  const isTeacher = true;

  const {data: lectureDetail} = useQuery<LectureDetailType>({
    queryKey: ['lectureDetail', lectureId],
    queryFn: () => getLectureDetail(lectureId),
  });

  const {data: studentLectureDetail} = useQuery<LectureStudentDetailType>({
    queryKey: ['studentLectureDetail', lectureId],
    queryFn: () => getStudentLectureDetail(lectureId),
    enabled: !isTeacher,
  });

  const {data: teacherLectureDetail} = useQuery<LectureTeacherDetailType>({
    queryKey: ['teacherLectureDetail', lectureId],
    queryFn: () => getTeacherLectureDetail(lectureId),
    enabled: isTeacher,
  });

  console.log('lectureDetail', lectureDetail);
  console.log('studentLectureDetail', studentLectureDetail);
  console.log('teacherLectureDetail', teacherLectureDetail);

  if (isTeacher) {
    // 선생님용
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
          classNumber={lectureDetail?.classNumber}
          pastTeacherName={lectureDetail?.teacher.name}
          backgroundColor={lectureDetail?.backgroundColor}
          fontColor={lectureDetail?.fontColor}
        />
        <View style={styles.content}>
          <View style={styles.firstRow}>
            <View style={styles.overviewLayout}>
              <OverviewForTeacher
                isTeacher={isTeacher}
                homeworkAvgScore={
                  teacherLectureDetail?.classAverageScores.homeworkAvgScore
                }
                testAvgScore={
                  teacherLectureDetail?.classAverageScores.testAvgScore
                }
                attitudeAvgScore={
                  teacherLectureDetail?.classAverageScores.attitudeAvgScore
                }
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
              <Homework homework={lectureDetail?.homework} />
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
              homeworkCnt={studentLectureDetail?.overview.homeworkCnt}
              examCnt={studentLectureDetail?.overview.examCnt}
              problemBoxCnt={studentLectureDetail?.overview.problemBoxCnt}
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
    top: -6,
    right: 12,
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
