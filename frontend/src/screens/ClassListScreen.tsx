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
import {useLectureStore} from '@store/useLectureStore';
import {useState} from 'react';
import {colors} from 'src/hooks/useColors';
import {getResponsiveSize} from '@utils/responsive';

function ClassListScreen(): React.JSX.Element {
  const setCurrentScreen = useCurrentScreenStore(
    state => state.setCurrentScreen,
  );

  useFocusEffect(() => {
    setCurrentScreen('ClassListScreen');
  });

  const {open} = useModal();

  // 샘플 데이터 (클래스 리스트)
  const classData = [
    {
      id: '1',
      lectureId: 101,
      title: '이게뭐여, 수학이여?',
      subject: '수학',
      backgroundColor: '#FF7171',
      fontColor: '#FFFFFF',
      grade: '3',
      classNumber: '2',
      teacherName: '백종원',
      lecturePeriod: 1,
      year: 2024,
      semester: 2,
    },
    {
      id: '2',
      lectureId: 112,
      title: '영어 텍스쳐 없죠?',
      subject: '영어',
      backgroundColor: '#F3FF84',
      fontColor: '#000000',
      grade: '3',
      classNumber: '2',
      teacherName: '롱기누스',
      lecturePeriod: 3,
      year: 2024,
      semester: 1,
    },
    {
      id: '3',
      lectureId: 113,
      title: '나야, 국어기름',
      subject: '국어',
      backgroundColor: '#6A80C8',
      fontColor: '#000000',
      grade: '3',
      classNumber: '2',
      teacherName: '강록최',
      lecturePeriod: 2,
      year: 2024,
      semester: 1,
    },
    {
      id: '4',
      lectureId: 114,
      title: '이게뭐여, 수학이여?',
      subject: '수학',
      backgroundColor: '#FF7171',
      fontColor: '#FFFFFF',
      grade: '3',
      classNumber: '2',
      teacherName: '백종원',
      lecturePeriod: 7,
      year: 2024,
      semester: 2,
    },
    {
      id: '5',
      lectureId: 115,
      title: '영어 텍스쳐 없죠?',
      subject: '영어',
      backgroundColor: '#F3FF84',
      fontColor: '#000000',
      grade: '3',
      classNumber: '2',
      teacherName: '롱기누스',
      lecturePeriod: 4,
      year: 2024,
      semester: 2,
    },
    {
      id: '6',
      lectureId: 116,
      title: '나야, 국어기름',
      subject: '국어',
      backgroundColor: '#6A80C8',
      fontColor: '#000000',
      grade: '3',
      classNumber: '2',
      teacherName: '강록최',
      lecturePeriod: 6,
      year: 2023,
      semester: 2,
    },
    {
      id: '7',
      lectureId: 117,
      title: '이게뭐여, 수학이여?',
      subject: '수학',
      backgroundColor: '#FF7171',
      fontColor: '#FFFFFF',
      grade: '3',
      classNumber: '2',
      teacherName: '백종원',
      lecturePeriod: 1,
      year: 2023,
      semester: 1,
    },
    {
      id: '8',
      lectureId: 118,
      title: '영어 텍스쳐 없죠?',
      subject: '영어',
      backgroundColor: '#F3FF84',
      fontColor: '#000000',
      grade: '3',
      classNumber: '2',
      teacherName: '롱기누스',
      lecturePeriod: 3,
      year: 2023,
      semester: 1,
    },
    {
      id: '9',
      lectureId: 119,
      title: '나야, 국어기름',
      subject: '국어',
      backgroundColor: '#6A80C8',
      fontColor: '#000000',
      grade: '3',
      classNumber: '2',
      teacherName: '강록최',
      lecturePeriod: 5,
      year: 2023,
      semester: 1,
    },
  ];

  const currentYear = new Date().getFullYear();
  const currentSemester = new Date().getMonth() < 6 ? 1 : 2;

  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    currentYear,
  );
  const [selectedSemester, setSelectedSemester] = useState<number | undefined>(
    currentSemester,
  );

  const {lectures} = useLectureStore();

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

  const filteredLectures = classData.filter(
    data =>
      (!selectedYear || data.year === selectedYear) &&
      (!selectedSemester || data.semester === selectedSemester),
  );

  return (
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
                subtitle={data.subject}
                backgroundColor={data.backgroundColor}
                fontColor={data.fontColor}
                grade={data.grade}
                classNumber={data.classNumber}
                teacherName={data.teacherName}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
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
