import {
  View,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCurrentScreenStore } from '@store/useCurrentScreenStore';
import { borderRadius } from '@theme/borderRadius';
import Book from '@components/common/Book';
import AddLectureModal from '@components/lectureList/AddLectureModal';
import { useModal } from '@hooks/useModal';
import AddCircleIcon from '@assets/icons/addCircleIcon.svg';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { colors } from '@hooks/useColors';
import { getResponsiveSize } from '@utils/responsive';
import { useQuery } from '@tanstack/react-query';
import {
  LectureListItemType,
  getLectureList,
} from '@services/lectureInformation';
import BookModal from '@components/common/BookModal';
import { useBookModalStore } from '@store/useBookModalStore';
import { useAuthStore } from '@store/useAuthStore';
import { Text } from '@components/common/Text';

function ClassListScreen(): React.JSX.Element {
  const { width } = useWindowDimensions();
  const styles = getStyles(width);

  const userInfo = useAuthStore(state => state.userInfo);
  const isTeacher = userInfo.role === 'TEACHER';
  const bookPosition = useBookModalStore(state => state.bookPosition);
  const setCurrentScreen = useCurrentScreenStore(
    state => state.setCurrentScreen,
  );

  useFocusEffect(() => {
    setCurrentScreen('ClassListScreen');
  });

  const { open } = useModal();
  const { data: lectures = [], isLoading } = useQuery<LectureListItemType[]>({
    queryKey: ['lectureList'],
    queryFn: getLectureList,
  });

  const currentYear = new Date().getFullYear();
  const currentSemester = new Date().getMonth() < 6 ? 1 : 2;

  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    currentYear,
  );
  const [selectedSemester, setSelectedSemester] = useState<number | undefined>(
    currentSemester,
  );

  const years = Array.from(
    new Set(
      lectures
        .map(item => item.year)
        .filter((year): year is number => year !== undefined),
    ),
  ).sort((a, b) => b - a);

  const handleCurrentSemester = () => {
    setSelectedYear(currentYear);
    setSelectedSemester(currentSemester);
  };

  const filteredLectures = lectures.filter(
    data =>
      (!selectedYear || data.year === selectedYear) &&
      (!selectedSemester || data.semester === selectedSemester),
  );

  if (isLoading) {
    return <Text>Loading...</Text>; // 로딩 상태 표시
  }

  return (
    <>
      {bookPosition && <BookModal />}
      <View style={styles.container}>
        <View style={styles.makeClass}>
          {isTeacher && (
            <TouchableOpacity
              onPress={() => {
                open(<AddLectureModal />, {
                  title: '수업 생성',
                  onClose: () => {
                    console.log('수업 생성 모달 종료');
                  },
                });
              }}>
              <AddCircleIcon
                style={{
                  marginLeft: getResponsiveSize(6),
                  marginVertical: getResponsiveSize(3),
                }}
                width={width * 0.04}
                height={width * 0.04}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={{ marginBottom: width * 0.01 }}>
          <Text variant="title" weight="bold">
            수업 목록
          </Text>
        </View>
        <View style={styles.classListContainer}>
          <View style={styles.header}>
            <View style={styles.filter}>
              <Picker
                selectedValue={selectedYear}
                onValueChange={itemValue => setSelectedYear(itemValue)}
                style={styles.picker}>
                <Picker.Item label="연도 선택" value="" />
                {years.map(year => (
                  <Picker.Item key={year} label={`${year}`} value={year} />
                ))}
              </Picker>

              <Picker
                selectedValue={selectedSemester}
                onValueChange={itemValue => setSelectedSemester(itemValue)}
                style={styles.picker}>
                <Picker.Item label="학기 선택" value={0} />
                <Picker.Item label="1학기" value={1} />
                <Picker.Item label="2학기" value={2} />
              </Picker>

              <TouchableOpacity
                onPress={handleCurrentSemester}
                style={styles.currentSemesterButton}>
                <Text>현재 학기</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.content}>
            <View style={styles.classList}>
              {filteredLectures.map((data, index) => (
                <View key={index} style={styles.bookContainer}>
                  <Book
                    key={index}
                    rightPosition={index * 25}
                    title={data.title}
                    subject={data.subject}
                    backgroundColor={data.backgroundColor}
                    fontColor={data.fontColor}
                    grade={data.grade}
                    classNumber={data.classNumber}
                    teacherName={data.teacher.name}
                    lectureId={data.lectureId}
                    isMain={false}
                  />
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </>
  );
}

export default ClassListScreen;

const getStyles = (width: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      padding: width * 0.01,
      backgroundColor: '#f0f0f0',
    },
    content: {
      position: 'relative',
      width: '100%',
      height: '100%',
    },
    makeClass: {
      position: 'absolute',
      zIndex: 1,
      right: width * 0.03,
      bottom: width * 0.03,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: width * 0.01,
    },
    filter: {
      marginLeft: 'auto',
      borderRadius: borderRadius.md,
      paddingHorizontal: 5,
      paddingVertical: 5,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    classList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: '100%',
      height: '100%',
    },
    bookContainer: {
      width: '25%',
    },
    picker: {
      width: 120,
    },
    currentSemesterButton: {
      padding: 5,
      borderRadius: 5,
      alignItems: 'center',
    },
    classListContainer: {
      flex: 1,
      backgroundColor: colors.light.background.white,
      borderRadius: borderRadius.xl,
      elevation: 2,
    },
  });
