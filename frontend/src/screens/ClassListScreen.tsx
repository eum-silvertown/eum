import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useCurrentScreenStore} from '@store/useCurrentScreenStore';
import {spacing} from '@theme/spacing';
import ScreenInfo from '@components/common/ScreenInfo';
import {borderRadius} from '@theme/borderRadius';
import Book from '@components/common/Book';
import AddLectureModal from '@components/lectureList/AddLectureModal';
import {iconSize} from '@theme/iconSize';
import {useModal} from 'src/hooks/useModal';
import AddCircleIcon from '@assets/icons/addCircleIcon.svg';
import {Picker} from '@react-native-picker/picker';
import {useState} from 'react';
import {colors} from 'src/hooks/useColors';
import {getResponsiveSize} from '@utils/responsive';
import {useQuery} from '@tanstack/react-query';
import {
  LectureListItemType,
  getLectureList,
} from '@services/lectureInformation';
import BookModal from '@components/common/BookModal';
import {useBookModalStore} from '@store/useBookModalStore';

function ClassListScreen(): React.JSX.Element {
  const bookPosition = useBookModalStore(state => state.bookPosition);
  const setCurrentScreen = useCurrentScreenStore(
    state => state.setCurrentScreen,
  );

  useFocusEffect(() => {
    setCurrentScreen('ClassListScreen');
  });

  const {open} = useModal();
  const {data: lectures = [], isLoading} = useQuery<LectureListItemType[]>({
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
        <View style={styles.header}>
          <ScreenInfo title="수업" />
          <TouchableOpacity
            onPress={() => {
              open(<AddLectureModal />, {
                title: '수업 생성',
                onClose: () => {
                  console.log('수업 생성 모달 종료');
                },
              });
            }}>
            <AddCircleIcon width={iconSize.lg} height={iconSize.lg} />
          </TouchableOpacity>
        </View>

        <View style={styles.classListContainer}>
          {/* filter 영역을 우측 상단에 배치 */}
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
        <View style={styles.content}>
          <View style={styles.classList}>
            {filteredLectures.map((data, index) => (
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
              />
            ))}
          </View>
        </View>
      </View>
    </View>
    </>
  );
}

export default ClassListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: spacing.xl,
  },
  content: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  header: {
    height: '7.5%',
    flexDirection: 'row',
  },
  filter: {
    marginLeft: 'auto',
    backgroundColor: 'white',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  classList: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
  picker: {
    width: 120,
  },
  currentSemesterButton: {
    padding: spacing.sm,
    borderRadius: 5,
    alignItems: 'center',
  },
  classListContainer: {
    flex: 1,
    backgroundColor: colors.light.background.white,
    borderRadius: borderRadius.xl,
    elevation: getResponsiveSize(2),
    padding: spacing.md,
  },
});
