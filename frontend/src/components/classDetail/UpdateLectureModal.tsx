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
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {
  toupdateLectureDetail,
  ToUpdateLectureResponse,
  updateLectureDetail,
  UpdateLectureRequest,
} from '@services/lectureInformation';
import {useBookModalStore} from '@store/useBookModalStore';

type ClassHeaderProps = {
  lectureId: number;
  grade: number;
  classNumber: number;
  pastTeacherName: string;
};

interface Schedule {
  day: string;
  period: number;
}

interface LectureProps {
  item: {
    title: string;
    subject: string;
    backgroundColor: string;
    fontColor: string;
    grade: number;
    classNumber: number;
    teacherName?: string;
    schedule: Schedule[];
  };
}

const UpdateLectureModal = ({
  lectureId,
  grade: pastGrade,
  classNumber: pastClassNumber,
  pastTeacherName,
}: ClassHeaderProps): React.JSX.Element => {
  const queryClient = useQueryClient();
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const {data: initialData} = useQuery<ToUpdateLectureResponse>({
    queryKey: ['updateNewLectureDetail', lectureId],
    queryFn: () => toupdateLectureDetail(lectureId),
  });
  const {setBookInfo} = useBookModalStore();

  // 초기 데이터를 상태에 설정하는 useEffect
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setSubjects(initialData.subject);
      setIntroduction(initialData.introduction);
      setCoverColor(initialData.backgroundColor);
      setFontColor(initialData.fontColor);
      setSchedules(
        initialData.schedule.map(schedule => ({
          day: schedule.day,
          period: schedule.period,
        })),
      );
      setLecturePreview({
        title: initialData.title,
        subject: initialData.subject,
        backgroundColor: initialData.backgroundColor,
        fontColor: initialData.fontColor,
        grade: pastGrade,
        schedule: initialData.schedule,
        classNumber: pastClassNumber,
        teacherName: pastTeacherName,
      });
    }
  }, [initialData, pastClassNumber, pastGrade, pastTeacherName]);

  const {mutate: updateLecture} = useMutation({
    mutationFn: (lectureData: UpdateLectureRequest) =>
      updateLectureDetail(lectureId, lectureData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['lectureDetail', lectureId],
      });
      queryClient.invalidateQueries({
        queryKey: ['lectureList'],
      });

      // BookInfo 업데이트 내용
      setBookInfo({
        title: title,
        subtitle: introduction,
        backgroundColor: coverColor,
        fontColor: fontColor,
        grade: pastGrade,
        classNumber: pastClassNumber,
        teacherName: pastTeacherName,
        lectureId: lectureId,
      });
      Alert.alert('성공', '강의가 성공적으로 수정되었습니다.');
      close();
    },
  });

  const {close} = useModalContext();
  const [title, setTitle] = useState('');
  const [subjects, setSubjects] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [coverColor, setCoverColor] = useState('');
  const [fontColor, setFontColor] = useState('');
  const [isColorPickerVisible, setColorPickerVisible] = useState(false);
  const [activePicker, setActivePicker] = useState<'cover' | 'font'>('cover');
  const colorPickerRef = useRef(null);
  const [schedules, setSchedules] = useState<Schedule[]>([
    {day: '', period: 0},
  ]);

  useEffect(() => {
    const currentYear = new Date().getFullYear().toString();
    const currentSemester = new Date().getMonth() < 6 ? '1' : '2';
    setYear(currentYear);
    setSemester(currentSemester);
    setLecturePreview(prevState => ({
      ...prevState,
      backgroundColor: coverColor || '#FFFFFF',
      fontColor: fontColor || '#000000',
    }));
  }, [coverColor, fontColor]);

  const [lecturePreview, setLecturePreview] = useState<LectureProps['item']>({
    title: '제목 없음',
    subject: '과목 없음',
    backgroundColor: '#FFFFFF',
    fontColor: '#000000',
    grade: 1,
    classNumber: 1,
    teacherName: '예시 선생님',
    schedule: [],
  });
  // 에러 메시지 상태 추가
  const [titleError, setTitleError] = useState('');
  const [subjectError, setSubjectError] = useState('');
  const [introductionError, setIntroductionError] = useState('');
  const [gradeError, setGradeError] = useState('');
  const [scheduleError, setScheduleError] = useState('');

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
      setSchedules([...schedules, {day: '', period: 0}]);
    } else {
      Alert.alert('최대 3개까지 시간표를 추가할 수 있습니다.');
    }
  };

  const handleDayChange = (value: string, index: number) => {
    const newSchedules = [...schedules];
    newSchedules[index].day = value;
    setSchedules(newSchedules);
  };

  const handlePeriodChange = (value: number, index: number) => {
    const newSchedules = [...schedules];
    newSchedules[index].period = Number(value);
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

  const handleUpdateLecture = () => {
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

    // 업데이트에 사용할 데이터 생성
    const lectureData: UpdateLectureRequest = {
      title,
      subject: subjects,
      introduction,
      backgroundColor: coverColor,
      fontColor,
      classId: initialData?.classId!,
      schedule: schedules.map(item => ({
        day: item.day,
        period: item.period,
      })),
      year: Number(year),
      semester: Number(semester),
    };
    console.log('lectureData', lectureData);

    updateLecture(lectureData); // 업데이트 요청

    console.log('LectureUpdateBook Data:', lectureData); // 콘솔에 JSON 데이터 출력
    close();
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.lectureInfoContainer}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text variant="subtitle" weight="bold">
                제목
              </Text>
              <Text weight="bold">
                {year}년 {semester}학기
              </Text>
            </View>
            <InputField
              placeholder="수업 제목을 입력해주세요."
              value={initialData?.title}
              onChangeText={setTitle}
            />
            <View style={styles.errorContainer}>
              {/* 제목 에러 메시지 */}
              {titleError ? (
                <StatusMessage message={titleError} status="error" />
              ) : null}
            </View>
            <Text variant="subtitle" weight="bold">
              과목
            </Text>
            <View style={styles.pickerSet}>
              <Picker
                style={styles.picker}
                selectedValue={initialData?.subject}
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
            <View>
              <Text variant="subtitle" weight="bold">
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

            <View style={styles.errorContainer}>
              {/* 학급 에러 메시지 */}
              {gradeError ? (
                <StatusMessage message={gradeError} status="error" />
              ) : null}
            </View>

            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text variant="subtitle" weight="bold">
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
                    <Picker.Item label="교시 선택" value={0} />
                    <Picker.Item label="1교시" value={1} />
                    <Picker.Item label="2교시" value={2} />
                    <Picker.Item label="3교시" value={3} />
                    <Picker.Item label="4교시" value={4} />
                    <Picker.Item label="5교시" value={5} />
                    <Picker.Item label="6교시" value={6} />
                    <Picker.Item label="7교시" value={7} />
                    <Picker.Item label="8교시" value={8} />
                    <Picker.Item label="9교시" value={9} />
                    <Picker.Item label="10교시" value={10} />
                    <Picker.Item label="11교시" value={11} />
                    <Picker.Item label="12교시" value={12} />
                    <Picker.Item label="13교시" value={13} />
                  </Picker>
                  <TouchableOpacity onPress={() => handleRemoveSchedule(index)}>
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

          {/* 구분선 추가 */}
          <View style={styles.separator} />

          <View style={styles.lecturePreviewContainer}>
            <Text variant="subtitle" weight="bold">
              생성된 수업 예시
            </Text>
            <View style={{alignItems: 'center'}}>
              {lecturePreview && <LectureCreateBook item={lecturePreview} />}
            </View>
            <View>
              <Text variant="subtitle" weight="bold">
                색상 선택
              </Text>

              <View style={{height: getResponsiveSize(288)}}>
                {!isColorPickerVisible ? (
                  <View style={styles.colorContainer}>
                    <TouchableOpacity
                      onPress={() => openColorPicker('cover')}
                      style={styles.colorButton}>
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
                      <Text style={styles.colorPickBtn} weight="bold">
                        표지 Color 선택
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => openColorPicker('font')}
                      style={styles.colorButton}>
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
                      <Text style={styles.colorPickBtn} weight="bold">
                        글자 Color 선택
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={[styles.colorPickerContainer]}>
                    <ColorPicker
                      ref={colorPickerRef}
                      initialColor={
                        activePicker === 'cover' ? coverColor : fontColor
                      }
                      onColorSelected={color => confirmColorSelection(color)}
                    />
                    <TouchableOpacity onPress={closeColorPicker}>
                      <Text style={styles.colorPickBtn}>선택 완료</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleUpdateLecture}>
          <Text color="white" weight="bold">
            수정
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    gap: 25,
  },
  lectureInfoContainer: {
    flex: 2,
  },
  lecturePreviewContainer: {
    gap: 3,
    flex: 2,
  },
  createButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    backgroundColor: '#2E2559',
  },
  colorButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  pickerContainer: {
    flex: 1,
    gap: getResponsiveSize(9),
  },
  confirmButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  colorPickerContainer: {
    transform: [{scale: 0.8}],
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 25,
    marginBottom: 25,
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
    width: getResponsiveSize(25),
    height: getResponsiveSize(25),
    borderRadius: borderRadius.sm,
    borderWidth: borderWidth.sm,
    borderColor: colors.light.borderColor.pickerBorder,
  },
  currentColorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  currentColorFont: {
    textShadowColor: 'gray', // 외곽선 색상 설정
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  pickerSet: {
    paddingHorizontal: 10,
    borderWidth: borderWidth.sm,
    borderColor: colors.light.borderColor.cardBorder,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: getResponsiveSize(44),
  },
  picker: {
    flex: 1,
    borderWidth: borderWidth.sm,
    borderColor: colors.light.borderColor.cardBorder,
    marginHorizontal: 5,
  },
  scrollViewContent: {
    paddingBottom: 10,
  },
  separator: {
    borderColor: '#CCC',
    borderWidth: getResponsiveSize(0.3),
    marginBottom: getResponsiveSize(16),
  },
  errorContainer: {
    minHeight: 15,
    justifyContent: 'center',
  },
  colorPickBtn: {
    backgroundColor: '#2e2559',
    color: 'white',
    padding: 10,
    borderRadius: borderRadius.sm,
  },
});

export default UpdateLectureModal;
