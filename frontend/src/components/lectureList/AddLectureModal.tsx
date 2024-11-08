import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,  
} from 'react-native';

import {Text} from '@components/common/Text';
import InputField from '@components/account/InputField';
import {spacing} from '@theme/spacing';
import {colors} from 'src/hooks/useColors';
import CustomDropdownPicker from '@components/common/CustomDropdownPicker';
import ColorPicker from '@components/lectureList/ColorPicker';
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
  const [day, setDay] = useState<string>('');
  const [period, setPeriod] = useState<string>('');
  const [scheduleList, setScheduleList] = useState<Schedule[]>([]);

  const [coverColor, setCoverColor] = useState('#2E2559');
  const [fontColor, setFontColor] = useState('#FFFFFF');
  const [isColorPickerVisible, setColorPickerVisible] = useState(false);
  const [activePicker, setActivePicker] = useState<'cover' | 'font'>('cover');
  const colorPickerRef = useRef(null);

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
    // 수업 시간표가 하나 이상 있는지 확인
    if (scheduleList.length === 0) {
      setScheduleError('최소 하나 이상의 시간표를 등록해야 합니다.');
      isValid = false;
    }

    // 유효성 검사 실패 시 함수 종료
    if (!isValid) return;

    const lectureData = {
      title,
      subject: subjects,
      introduction,
      backgroundColor: coverColor,
      fontColor,
      classId: parseInt(classNumber, 10) || 0, // 클래스 정보가 숫자로 필요하다면 파싱
      year,
      semester,
      schedule: scheduleList.map(item => ({
        day: item.day,
        period: parseInt(item.period, 10), // period도 숫자로 파싱
      })),
    };
    Alert.alert('수업이 등록되었습니다.');
    console.log('LectureCreateBook Data:', lectureData); // 콘솔에 JSON 데이터 출력
    close();
  };

  const handleAddSchedule = () => {
    // 요일과 교시가 선택되었는지 확인
    if (!day || !period) {
      Alert.alert('입력 오류', '요일과 교시를 모두 선택해주세요.');
      return;
    }

    if (scheduleList.length >= 3) {
      Alert.alert('시간표는 3개까지 등록 가능합니다.');
      return;
    }

    // 중복 체크
    const isDuplicate = scheduleList.some(
      item => item.day === day && item.period === period,
    );

    if (isDuplicate) {
      Alert.alert('중복된 시간표', '이미 등록된 시간표입니다.');
      return;
    }

    // 중복이 아니면 추가하고 요일순 정렬
    const newSchedule: Schedule = {day, period};
    const updatedList = [...scheduleList, newSchedule].sort((a, b) =>
      a.day.localeCompare(b.day),
    );
    setScheduleList(updatedList);
  };

  const handleRemoveSchedule = (index: number) => {
    const updatedList = [...scheduleList];
    updatedList.splice(index, 1);
    setScheduleList(updatedList);
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
    <View>
      <View style={styles.content}>
        <View style={styles.innerContainer}>
          <Text align="right" weight="bold">
            {year}년 {semester}학기
          </Text>
          <View>
            <CustomDropdownPicker
              label="과목"
              items={[
                {label: '과목 선택', value: ''},
                {label: '국어', value: '국어'},
                {label: '영어', value: '영어'},
                {label: '수학', value: '수학'},
              ]}
              placeholder="과목 선택"
              onSelectItem={itemValue => setSubjects(itemValue)}
              defaultValue={subjects}
            />
            {/* 에러 메시지 */}
            {subjectError ? (
              <StatusMessage message={subjectError} status="error" />
            ) : null}
          </View>
          <InputField
            label="제목"
            placeholder="수업 제목을 입력해주세요."
            value={title}
            onChangeText={setTitle}
            status="error"
            statusText={titleError}
          />

          <View>
            <View style={styles.pickers}>
              <View style={styles.picker}>
                <CustomDropdownPicker
                  label="학년"
                  items={Array.from({length: 4}, (_, i) => ({
                    label: i === 0 ? '학년 선택' : `${i}학년`,
                    value: `${i}`,
                  }))}
                  placeholder="학년 선택"
                  onSelectItem={itemValue => setGrade(itemValue)}
                  defaultValue={grade}
                />
              </View>
              <View style={styles.picker}>
                <CustomDropdownPicker
                  label="반"
                  items={Array.from({length: 16}, (_, i) => ({
                    label: i === 0 ? '반 선택' : `${i}반`,
                    value: `${i}`,
                  }))}
                  placeholder="반 선택"
                  onSelectItem={itemValue => setClassNumber(itemValue)}
                  defaultValue={classNumber}
                />
              </View>
            </View>
            <View style={styles.errorContainer}>
              {/* 학급 에러 메시지 */}
              {gradeError ? (
                <StatusMessage message={gradeError} status="error" />
              ) : null}
            </View>
          </View>

          <InputField
            label="수업 소개"
            placeholder="한 줄 수업 소개를 입력해주세요."
            value={introduction}
            onChangeText={setIntroduction}
            multiline={true}
            status="error"
            statusText={introductionError}
          />

          <View>
            <Text variant="subtitle" weight="bold" style={styles.contentLabel}>
              수업 시간표 등록
            </Text>

            <View style={styles.pickers}>
              <View style={styles.picker}>
                <CustomDropdownPicker
                  items={[
                    {label: '월요일', value: '월요일'},
                    {label: '화요일', value: '화요일'},
                    {label: '수요일', value: '수요일'},
                    {label: '목요일', value: '목요일'},
                    {label: '금요일', value: '금요일'},
                  ]}
                  placeholder="요일 선택"
                  onSelectItem={(value: string) => setDay(value)}
                  defaultValue={day}
                />
              </View>
              <View style={styles.picker}>
                <CustomDropdownPicker
                  items={[
                    {label: '1교시', value: '1교시'},
                    {label: '2교시', value: '2교시'},
                    {label: '3교시', value: '3교시'},
                    {label: '4교시', value: '4교시'},
                    {label: '5교시', value: '5교시'},
                    {label: '6교시', value: '6교시'},
                  ]}
                  placeholder="교시 선택"
                  onSelectItem={(value: string) => setPeriod(value)}
                  defaultValue={period}
                />
              </View>
              <TouchableOpacity onPress={handleAddSchedule}>
                <AddCircleIcon width={iconSize.lg} height={iconSize.lg} />
              </TouchableOpacity>
            </View>

            <View style={styles.listContainer}>
              {scheduleList.map((item, index) => (
                <View
                  key={`${item.day}-${item.period}`}
                  style={styles.scheduleItem}>
                  <Text>{`${item.day} - ${item.period}`}</Text>
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
        </View>

        {/* 구분선 추가 */}
        <View style={styles.separator} />

        <View style={styles.innerContainer}>
          <Text variant="subtitle" weight="bold" style={styles.contentLabel}>
            생성된 수업 예시
          </Text>
          <View style={{alignItems: 'center', transform: [{scale: 0.9}]}}>
            {lecturePreview && <LectureCreateBook item={lecturePreview} />}
          </View>

          <View>
            <Text variant="subtitle" weight="bold" style={styles.contentLabel}>
              색상 선택
            </Text>

            <View style={{height: getResponsiveSize(180)}}>
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
                        style={[styles.colorBox, {backgroundColor: coverColor}]}
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
                          style={[styles.currentColorFont, {color: fontColor}]}>
                          {fontColor.toUpperCase()}
                        </Text>
                      </Text>
                      <View
                        style={[styles.colorBox, {backgroundColor: fontColor}]}
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
        <Text weight="bold" color="white">
          생성
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
  contentLabel: {
    marginBottom: spacing.sm,
  },
  innerContainer: {
    flex: 1,
  },
  createButton: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.light.background.main,
    alignItems: 'center',
  },
  colorButton: {
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
  pickers: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  picker: {
    flex: 1,
  },
  separator: {
    borderWidth: borderWidth.xs,
  },
  errorContainer: {
    minHeight: spacing.lg,
    justifyContent: 'center',
  },
  listContainer: {
    height: getResponsiveSize(50),
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: borderWidth.sm,
    borderColor: '#ddd',
  },
});

export default AddLectureModal;
