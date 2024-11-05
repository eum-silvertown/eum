import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from '@components/common/Text';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScreenType} from '@store/useCurrentScreenStore';
import {spacing} from '@theme/spacing';
import ScreenInfo from '@components/common/ScreenInfo';
import {Picker} from '@react-native-picker/picker';
import AddLectureModal from '@components/lectureList/AddLectureModal';
import {colors} from 'src/hooks/useColors';
import {borderRadius} from '@theme/borderRadius';
import {getResponsiveSize} from '@utils/responsive';
import {useModal} from '@store/useModalStore';

type NavigationProps = NativeStackNavigationProp<ScreenType>;

const classData = [
  {id: '1', title: '수학', year: '2023', color: '#ff0000'},
  {id: '2', title: '영어', year: '2022', color: '#0000ff'},
  {id: '3', title: '과학', year: '2023', color: '#00ff00'},
  {id: '4', title: '국어', year: '2021', color: '#ffff00'},
  {id: '5', title: '국어', year: '2024', color: '#ffff00'},
];

function ClassListScreen(): React.JSX.Element {
  const navigation = useNavigation<NavigationProps>();
  const [selectedYear, setSelectedYear] = useState<string | undefined>();
  const [selectedSemester, setSelectedSemester] = useState<
    string | undefined
  >();
  const [lectureModalVisible, setAddLectureModalVisible] =
    useState<boolean>(false);
  const {open} = useModal();

  // 현재 연도와 학기 계산
  const currentYear = new Date().getFullYear().toString();
  const currentSemester = new Date().getMonth() < 6 ? '1' : '2';

  // 중복 제거된 연도 목록 생성
  const years = Array.from(new Set(classData.map(item => item.year))).sort(
    (a, b) => parseInt(b) - parseInt(a),
  );

  const handlePress = (classId: string) => {
    // navigation.navigate('ClassDetailScreen', { classId });
  };

  // 현재 학기 설정
  const handleCurrentSemester = () => {
    setSelectedYear(currentYear);
    setSelectedSemester(currentSemester);
  };

  return (
    <View style={styles.container}>
      <ScreenInfo title="수업" />

      <View style={styles.header}>
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
          <Picker.Item label="학기 선택" value="" />
          <Picker.Item label="1학기" value="1" />
          <Picker.Item label="2학기" value="2" />
        </Picker>

        <TouchableOpacity
          onPress={handleCurrentSemester}
          style={styles.currentSemesterButton}>
          <Text color="white" weight="bold">
            현재 학기
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            open(<AddLectureModal />, {
              title: '수업 생성',
              onClose: () => {
                console.log('수업 생성 모달 종료');
              },
            });
          }}>
          <Text>수업 생성</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.classList}>
        {classData
          .filter(data => !selectedYear || data.year === selectedYear) // 연도 필터 적용
          .map(data => (
            <TouchableOpacity
              key={data.id}
              onPress={() => handlePress(data.id)}
              style={[styles.classItem, {backgroundColor: data.color}]}>
              <Text color="white" weight="bold" align="center">
                {data.title}
              </Text>
            </TouchableOpacity>

            
            
          ))}
      </View>
    </View>
  );
}

export default ClassListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: colors.light.background.white,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  picker: {
    flex: 1,
    height: 40,
  },
  currentSemesterButton: {
    padding: spacing.sm,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  classList: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.light.background.white,
    elevation: getResponsiveSize(2),
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  classItem: {
    width: '45%',
    padding: spacing.md,
    borderRadius: 5,
    alignItems: 'center',
  },
});
