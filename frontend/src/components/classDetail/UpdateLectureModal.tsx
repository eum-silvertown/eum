import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import {Text} from '@components/common/Text';
import InputField from '@components/account/InputField';
import {spacing} from '@theme/spacing';
import {colors} from 'src/hooks/useColors';
import ColorPicker from '@components/lectureList/ColorPicker';
import {Picker} from '@react-native-picker/picker';
import AddCircleIcon from '@assets/icons/addCircleIcon.svg';
import {iconSize} from '@theme/iconSize';
import {borderRadius} from '@theme/borderRadius';
import {borderWidth} from '@theme/borderWidth';
import LectureCreateBook from '@components/main/LectureCreateBook';
import {getResponsiveSize} from '@utils/responsive';
import CancelIcon from '@assets/icons/cancelIcon.svg';
import StatusMessage from '@components/account/StatusMessage';
import {useModalContext} from 'src/contexts/useModalContext';

interface AddLectureModalProps {}

interface Schedule {
  day: string;
  period: string;
}

interface LectureProps {
  item: {
    title: string;
    subject: string;
    backgroundColor: string;
    fontColor: string;
    grade: string;
    classNumber: string;
    teacherName?: string;
    lecturePeriod?: number;
  };
}

const AddLectureModal = ({}: AddLectureModalProps): React.JSX.Element => {
  const {close} = useModalContext();
  const [title, setTitle] = useState('');
  const [subjects, setSubjects] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [coverColor, setCoverColor] = useState('#2E2559');
  const [fontColor, setFontColor] = useState('#FFFFFF');
  const [isColorPickerVisible, setColorPickerVisible] = useState(false);
  const [activePicker, setActivePicker] = useState<'cover' | 'font'>('cover');
  const colorPickerRef = useRef(null);
  const [schedules, setSchedules] = useState<Schedule[]>([
    {day: '', period: ''},
  ]);
  const [grade, setGrade] = useState('');
  const [classNumber, setClassNumber] = useState('');
  const [lecturePreview, setLecturePreview] = useState<LectureProps['item']>({
    title: '제목 없음',
    subject: '과목 없음',
    backgroundColor: '#FFFFFF',
    fontColor: '#000000',
    grade: '1',
    classNumber: '1',
    teacherName: '예시 선생님', // 기본값을 설정
  });
  // 에러 메시지 상태 추가
  const [titleError, setTitleError] = useState('');
  const [subjectError, setSubjectError] = useState('');
  const [introductionError, setIntroductionError] = useState('');
  const [gradeError, setGradeError] = useState('');
  const [scheduleError, setScheduleError] = useState('');

  useEffect(() => {
    const currentYear = new Date().getFullYear().toString();
    const currentSemester = new Date().getMonth() < 6 ? '1' : '2';
    setYear(currentYear);
    setSemester(currentSemester);
  }, []);

  const openColorPicker = (pickerType: 'cover' | 'font') => {
    setActivePicker(pickerType);
    setColorPickerVisible(true);
  };

  const closeColorPicker = () => {
    setColorPickerVisible(false);
  };

  const confirmColorSelection = (color: string) => {
    if (activePicker === 'cover') {
      setCoverColor(color);
    } else if (activePicker === 'font') {
      setFontColor(color);
    }
  };

  const addPickerSet = () => {
    if (schedules.length < 3) {
      setSchedules([...schedules, {day: '', period: ''}]);
    } else {
      Alert.alert('최대 3개까지 시간표를 추가할 수 있습니다.');
    }
  };

  const handleDayChange = (value: string, index: number) => {
    const newSchedules = [...schedules];
    newSchedules[index].day = value;
    setSchedules(newSchedules);
  };

  const handlePeriodChange = (value: string, index: number) => {
    const newSchedules = [...schedules];
    newSchedules[index].period = value;
    setSchedules(newSchedules);
  };

  const handleRemoveSchedule = (index: number) => {
    if (schedules.length > 1) {
      const newSchedules = [...schedules];
      newSchedules.splice(index, 1); // 해당 인덱스의 항목을 삭제
      setSchedules(newSchedules);
    } else {
      Alert.alert('하나의 시간표는 반드시 있어야 합니다.');
    }
  };

  const handleCreateLecture = () => {
    // 에러 메시지를 초기화
    setTitleError('');
    setSubjectError('');
    setIntroductionError('');
    setGradeError('');
    setScheduleError('');

    let isValid = true;

    // 유효성 검사 및 에러 메시지 설정
    if (!title.trim()) {
      setTitleError('제목을 입력해주세요.');
      isValid = false;
    }
    if (!subjects.trim()) {
      setSubjectError('과목을 선택해주세요.');
      isValid = false;
    }
    if (!introduction.trim()) {
      setIntroductionError('수업 소개를 입력해주세요.');
      isValid = false;
    }
    if (!grade.trim() || !classNumber.trim()) {
      setGradeError('학급 정보를 선택해주세요.');
      isValid = false;
    }
    if (
      schedules.length === 0 ||
      schedules.some(item => !item.day || !item.period)
    ) {
      setScheduleError(
        '수업 시간표를 모두 입력하거나 불필요한 항목은 삭제해주세요.',
      );
      isValid = false;
    }

    // 유효성 검사 실패 시 함수 종료
    if (!isValid) {
      return;
    }

    const lectureData = {
      title,
      subject: subjects,
      introduction,
      backgroundColor: coverColor,
      fontColor,
      classId: parseInt(classNumber, 10) || 0, // 클래스 정보가 숫자로 필요하다면 파싱
      year,
      semester,
      schedule: schedules.map(item => ({
        day: item.day,
        period: parseInt(item.period, 10), // period도 숫자로 파싱
      })),
    };

    console.log('LectureCreateBook Data:', lectureData); // 콘솔에 JSON 데이터 출력
    close();
  };

  useEffect(() => {
    setLecturePreview({
      title: title || '제목 없음',
      subject: subjects || '과목 없음',
      backgroundColor: coverColor || '#FFFFFF',
      fontColor: fontColor || '#000000',
      grade: grade || '1',
      classNumber: classNumber || '1',
    });
  }, [title, subjects, coverColor, fontColor, grade, classNumber]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.lectureInfoContainer}>
            <View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text
                  variant="subtitle"
                  weight="bold"
                  style={styles.contentLabel}>
                  제목
                </Text>
                <Text weight="bold">
                  {year}년 {semester}학기
                </Text>
              </View>
              <InputField
                placeholder="수업 제목을 입력해주세요."
                value={title}
                onChangeText={setTitle}
              />
              <View style={styles.errorContainer}>
                {/* 제목 에러 메시지 */}
                {titleError ? (
                  <StatusMessage message={titleError} status="error" />
                ) : null}
              </View>
            </View>

            <View>
              <Text
                variant="subtitle"
                weight="bold"
                style={styles.contentLabel}>
                과목
              </Text>
              <View style={styles.pickerSet}>
                <Picker
                  style={styles.picker}
                  selectedValue={subjects}
                  onValueChange={itemValue => setSubjects(itemValue)}>
                  <Picker.Item key={0} label="과목 선택" value="" />
                  <Picker.Item key={1} label="국어" value="국어" />
                  <Picker.Item key={2} label="영어" value="영어" />
                  <Picker.Item key={3} label="수학" value="수학" />
                </Picker>
                {/* 과목 에러 메시지 */}
              </View>
              {subjectError ? (
                <StatusMessage message={subjectError} status="error" />
              ) : null}
            </View>
            <View>
              <Text
                variant="subtitle"
                weight="bold"
                style={styles.contentLabel}>
                수업 소개
              </Text>
              <InputField
                placeholder="한 줄 수업 소개를 입력해주세요."
                value={introduction}
                onChangeText={setIntroduction}
                multiline={true}
              />
              <View style={styles.errorContainer}>
                {/* 수업 소개 에러 메시지 */}
                {introductionError ? (
                  <StatusMessage message={introductionError} status="error" />
                ) : null}
              </View>
            </View>

            <View>
              <Text
                variant="subtitle"
                weight="bold"
                style={styles.contentLabel}>
                학급
              </Text>
              <View style={styles.pickerSet}>
                <Picker
                  selectedValue={grade}
                  onValueChange={itemValue => setGrade(itemValue)}
                  style={styles.picker}>
                  {Array.from({length: 4}, (_, i) => (
                    <Picker.Item
                      key={i}
                      label={i === 0 ? '학년 선택' : `${i}학년`}
                      value={`${i}`}
                    />
                  ))}
                </Picker>
                <Picker
                  selectedValue={classNumber}
                  onValueChange={itemValue => setClassNumber(itemValue)}
                  style={styles.picker}>
                  {Array.from({length: 16}, (_, i) => (
                    <Picker.Item
                      key={i}
                      label={i === 0 ? '반 선택' : `${i}반`}
                      value={`${i}`}
                    />
                  ))}
                </Picker>
              </View>
              <View style={styles.errorContainer}>
                {/* 학급 에러 메시지 */}
                {gradeError ? (
                  <StatusMessage message={gradeError} status="error" />
                ) : null}
              </View>
            </View>

            <View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text
                  variant="subtitle"
                  weight="bold"
                  style={styles.contentLabel}>
                  수업 시간표
                </Text>
                <TouchableOpacity onPress={addPickerSet}>
                  <AddCircleIcon width={iconSize.lg} height={iconSize.lg} />
                </TouchableOpacity>
              </View>
              {/* 추가된 요일 및 교시 Picker 렌더링 */}
              <View style={styles.pickerContainer}>
                {schedules.map((schedule, index) => (
                  <View key={index} style={styles.pickerSet}>
                    <Picker
                      selectedValue={schedule.day}
                      onValueChange={value => handleDayChange(value, index)}
                      style={styles.picker}>
                      <Picker.Item label="요일 선택" value="" />
                      <Picker.Item label="월요일" value="월요일" />
                      <Picker.Item label="화요일" value="화요일" />
                      <Picker.Item label="수요일" value="수요일" />
                      <Picker.Item label="목요일" value="목요일" />
                      <Picker.Item label="금요일" value="금요일" />
                    </Picker>
                    <Picker
                      selectedValue={schedule.period}
                      onValueChange={value => handlePeriodChange(value, index)}
                      style={styles.picker}>
                      <Picker.Item label="교시 선택" value="" />
                      <Picker.Item label="1교시" value="1교시" />
                      <Picker.Item label="2교시" value="2교시" />
                      <Picker.Item label="3교시" value="3교시" />
                      <Picker.Item label="4교시" value="4교시" />
                      <Picker.Item label="5교시" value="5교시" />
                      <Picker.Item label="6교시" value="6교시" />
                    </Picker>
                    <TouchableOpacity
                      onPress={() => handleRemoveSchedule(index)}>
                      <CancelIcon width={iconSize.xs} height={iconSize.xs} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              <View style={styles.errorContainer}>
                {/* 시간표 에러 메시지 */}
                {scheduleError ? (
                  <StatusMessage message={scheduleError} status="error" />
                ) : null}
              </View>
            </View>
          </View>

          {/* 구분선 추가 */}
          <View style={styles.separator} />

          <View style={styles.lecturePreviewContainer}>
            <Text variant="subtitle" weight="bold" style={styles.contentLabel}>
              생성된 수업 예시
            </Text>
            <View style={{alignItems: 'center'}}>
              {lecturePreview && <LectureCreateBook item={lecturePreview} />}
            </View>
            <View>
              <Text
                variant="subtitle"
                weight="bold"
                style={styles.contentLabel}>
                색상 선택
              </Text>

              <View style={{height: getResponsiveSize(240)}}>
                {!isColorPickerVisible ? (
                  <View style={styles.colorContainer}>
                    <TouchableOpacity
                      onPress={() => openColorPicker('cover')}
                      style={styles.colorButton}>
                      <Text weight="bold">표지 색상 선택</Text>
                      <View style={styles.currentColorContainer}>
                        <Text>
                          현재 선택된 색상 :{' '}
                          <Text
                            style={[
                              styles.currentColorFont,
                              {color: coverColor},
                            ]}>
                            {coverColor.toUpperCase()}
                          </Text>
                        </Text>
                        <View
                          style={[
                            styles.colorBox,
                            {backgroundColor: coverColor},
                          ]}
                        />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => openColorPicker('font')}
                      style={styles.colorButton}>
                      <Text weight="bold">표지 글자 색상 선택</Text>
                      <View style={styles.currentColorContainer}>
                        <Text>
                          현재 선택된 색상 :{' '}
                          <Text
                            style={[
                              styles.currentColorFont,
                              {color: fontColor},
                            ]}>
                            {fontColor.toUpperCase()}
                          </Text>
                        </Text>
                        <View
                          style={[
                            styles.colorBox,
                            {backgroundColor: fontColor},
                          ]}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={[styles.colorPickerContainer]}>
                    <View style={styles.colorPicker}>
                      <ColorPicker
                        ref={colorPickerRef}
                        initialColor={
                          activePicker === 'cover' ? coverColor : fontColor
                        }
                        onColorSelected={color => confirmColorSelection(color)}
                      />
                    </View>
                    <TouchableOpacity onPress={closeColorPicker}>
                      <Text>색상 선택</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateLecture}>
          <Text weight="bold">생성</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.md,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.xl,
  },
  contentLabel: {
    marginBottom: spacing.sm,
  },
  lectureInfoContainer: {
    gap: spacing.sm,
    flex: 3,
  },
  lecturePreviewContainer: {
    gap: spacing.md,
    flex: 2,
  },
  createButton: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  colorButton: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  confirmButton: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  colorPickerContainer: {
    transform: [{scale: 0.9}],
    flex: 1,
    height: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  colorPicker: {
    flex: 1,
  },
  colorContainer: {
    height: '100%',
    borderWidth: borderWidth.sm,
    borderColor: colors.light.borderColor.cardBorder,
    borderRadius: borderRadius.lg,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  colorBox: {
    width: getResponsiveSize(16),
    height: getResponsiveSize(16),
    borderRadius: borderRadius.sm,
    borderWidth: borderWidth.sm,
    borderColor: colors.light.borderColor.pickerBorder,
  },
  currentColorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  currentColorFont: {
    textShadowColor: 'black',
    textShadowRadius: 1,
  },
  pickerContainer: {
    flex: 1,
    gap: spacing.sm,
  },
  pickerSet: {
    paddingHorizontal: spacing.md,
    borderWidth: borderWidth.sm,
    borderColor: colors.light.borderColor.cardBorder,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: getResponsiveSize(40), // 원하는 높이로 설정
  },
  picker: {
    flex: 1,
    borderWidth: borderWidth.sm,
    borderColor: colors.light.borderColor.cardBorder,
    marginHorizontal: spacing.sm,
  },
  scrollViewContent: {
    paddingBottom: spacing.md,
  },
  separator: {
    borderWidth: borderWidth.xs,
  },
  errorContainer: {
    minHeight: spacing.lg,
    justifyContent: 'center',
  },
});

export default AddLectureModal;
