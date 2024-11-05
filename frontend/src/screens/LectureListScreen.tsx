import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {Text} from '@components/common/Text';
import {spacing} from '@theme/spacing';
import ScreenInfo from '@components/common/ScreenInfo';
import {Picker} from '@react-native-picker/picker';
import AddLectureModal from '@components/lectureList/AddLectureModal';
import {colors} from 'src/hooks/useColors';
import {borderRadius} from '@theme/borderRadius';
import {getResponsiveSize} from '@utils/responsive';
import {useModal} from 'src/hooks/useModal';
import {useLectureStore} from '@store/useLectureStore';
import Lecture from '@components/main/Lecture';

import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScreenType} from '@store/useCurrentScreenStore';
import AddCircleIcon from '@assets/icons/addCircleIcon.svg';
import {iconSize} from '@theme/iconSize';

type NavigationProps = NativeStackNavigationProp<ScreenType>;

function LectureListScreen(): React.JSX.Element {
  // 현재 연도와 학기 계산
  const currentYear = new Date().getFullYear();
  const currentSemester = new Date().getMonth() < 6 ? 1 : 2;

  const navigation = useNavigation<NavigationProps>();
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    currentYear,
  );
  const [selectedSemester, setSelectedSemester] = useState<number | undefined>(
    currentSemester,
  );
  const {lectures} = useLectureStore();
  const {open} = useModal();

  // 중복 제거된 연도 목록 생성
  const years = Array.from(
    new Set(
      lectures
        .map(item => item.year)
        .filter((year): year is number => year !== undefined),
    ),
  ).sort((a, b) => b - a);

  // 임시로 스크린 이동
  const handleMoveLectureDetail = () => {
    navigation.navigate('ClassDetailScreen');
  };

  // 현재 학기 설정
  const handleCurrentSemester = () => {
    setSelectedYear(currentYear);
    setSelectedSemester(currentSemester);
  };

  // 연도와 학기 필터 적용
  const filteredLectures = lectures.filter(
    data =>
      (!selectedYear || data.year === selectedYear) && // 연도 필터 적용
      (!selectedSemester || data.semester === selectedSemester), // 학기 필터 적용
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
          <AddCircleIcon width={iconSize.xl} height={iconSize.xl} />
        </TouchableOpacity>
      </View>

      <View style={styles.classListContainer}>
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
            <Text weight="bold">현재 학기</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={styles.classList}
          showsVerticalScrollIndicator={false}>
          {lectures
            .filter(data => !selectedYear || data.year === selectedYear)
            .filter(
              data => !selectedSemester || data.semester === selectedSemester,
            )
            .map(data => (
              <TouchableOpacity
                key={data.lectureId}
                onPress={handleMoveLectureDetail}>
                <Lecture item={data}></Lecture>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>
    </View>
  );
}

export default LectureListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filter: {    
    width: '30%',
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  picker: {
    flex: 1,
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
    padding: spacing.lg,
  },
  classList: {
    alignSelf: 'center',
    width: '95%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: spacing.md,
  },
});
