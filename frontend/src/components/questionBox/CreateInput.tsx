import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { spacing } from '@theme/spacing';
import { borderRadius } from '@theme/borderRadius';
import { colors } from 'src/hooks/useColors';
import DatePicker from 'react-native-date-picker';
import { getResponsiveSize } from '@utils/responsive';
import { borderWidth } from '@theme/borderWidth';
import { DetailQuestionType } from '@services/questionBox';
import ProblemExSection from './ProblemExSection';

type CreateInputProps = {
  title: string;
  setTitle: (title: string) => void;
  selectedFiles: string[];
  setSelectedFiles: (files: string[]) => void;
  handleCreateLectureAction: () => void;
  selectType: 'lesson' | 'exam' | 'homework';
  setStartTime?: (time: Date) => void;
  setEndTime?: (time: Date) => void;
  setDuration?: (duration: number) => void;
  questionDetail?: DetailQuestionType | null;
};

function CreateInput({
  title,
  setTitle,
  selectedFiles,
  setSelectedFiles,
  handleCreateLectureAction,
  selectType,
  setStartTime,
  setEndTime,
  setDuration,
  questionDetail,
}: CreateInputProps): React.JSX.Element {
  const getCurrentTime = (): Date => {
    const now = new Date();
    now.setSeconds(0, 0);
    now.setMinutes(now.getMinutes() + 3); // 3분 추가 (여유시간)
    return now;
  };

  const [startTime, setLocalStartTime] = useState<Date>(getCurrentTime());
  const [endTime, setLocalEndTime] = useState<Date>(getCurrentTime());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'start' | 'end'>('start');
  const [selectedDuration, setSelectedDuration] = useState<number>(5);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [buttonMessage, setButtonMessage] = useState('제목을 입력하세요'); // 기본

  const validateFields = () => {
    const now = new Date();

    if (!title) {
      setIsButtonDisabled(true);
      setButtonMessage('제목을 입력해주세요');
      return;
    }
    if ((selectType === 'exam' || selectType === 'homework' || selectType === 'lesson') && selectedFiles.length === 0) {
      setIsButtonDisabled(true);
      setButtonMessage('길게 터치하여 문제를 추가해주세요');
      return;
    }
    if (selectType === 'homework' && endTime <= startTime) {
      setIsButtonDisabled(true);
      setButtonMessage('종료 시간을 시작 시간 이후로 설정해주세요');
      return;
    }
    if (startTime < now) {
      setIsButtonDisabled(true);
      setButtonMessage('시작 시간을 현재 시간 이후로 설정해주세요');
      return;
    }
    if (selectType === 'homework' && endTime < now) {
      setIsButtonDisabled(true);
      setButtonMessage('종료 시간을 현재 시간 이후로 설정해주세요');
      return;
    }
    setIsButtonDisabled(false);
    setButtonMessage(''); // 모든 조건 만족 시 버튼 활성화
  };

  // 유효성 검사에 따른 버튼 상태 및 메시지 업데이트
  useEffect(() => {
    validateFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, selectedFiles, startTime, endTime, selectType]);

  const handleButtonPress = () => {
    if (!isButtonDisabled) {
      handleCreateLectureAction();
    }
  };

  const handleDurationChange = (duration: number) => {
    setSelectedDuration(duration);
    setDuration?.(duration);
  };

  const openDatePicker = (mode: 'start' | 'end') => {
    setDatePickerMode(mode);
    setDatePickerVisible(true);
  };

  const handleDateConfirm = (selectedDate: Date) => {
    const now = new Date();

    if (datePickerMode === 'start') {
      if (selectedDate < now) {
        Alert.alert('알림', '시작 시간은 현재 시간 이후로 설정해야 합니다.');
      } else {
        setLocalStartTime(selectedDate);
        setStartTime?.(selectedDate);
        setLocalEndTime(selectedDate);
        setEndTime?.(selectedDate);
      }
    } else {
      if (selectedDate <= startTime) {
        Alert.alert('알림', '종료 시간은 시작 시간 이후로 설정해야 합니다.');
      } else if (selectedDate < now) {
        Alert.alert('알림', '종료 시간은 현재 시간 이후로 설정해야 합니다.');
      } else {
        setLocalEndTime(selectedDate);
        setEndTime?.(selectedDate);
      }
    }
    setDatePickerVisible(false);
  };

  // 파일 삭제 함수
  const removeSelectedFile = (fileName: string) => {
    const updatedFiles = selectedFiles.filter(file => file !== fileName);
    setSelectedFiles(updatedFiles);
  };

  return (
    <View style={styles.layout}>
      <View style={styles.container}>
        <View style={styles.topSection}>
          {questionDetail ? (
            <View style={styles.exProblemContainer}>
              <Text style={styles.detailText}>파일명: {questionDetail.title}</Text>
              <ProblemExSection problemText={questionDetail.content} />
              <Text style={styles.detailText}>정답: {questionDetail.answer}</Text>
            </View>
          ) : (
            <>
              <Text style={styles.sectionTitle}>미리보기</Text>
              <Text>파일을 터치하면 문제를 미리볼 수 있습니다.</Text>
            </>
          )}
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="제목을 입력하세요"
            value={title}
            onChangeText={text => {
              setTitle(text);
              validateFields();
            }}
          />

          <Text style={styles.label}>선택된 문제 ({selectedFiles.length}개)</Text>
          <FlatList
            nestedScrollEnabled
            data={selectedFiles}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.fileItem}>
                <Text style={styles.fileName}>{item}</Text>
                <TouchableOpacity onPress={() => removeSelectedFile(item)}>
                  <Text style={styles.removeText}>⨯</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          {selectType === 'exam' && (
            <>
              <Text style={styles.label}>시험 시작 시간</Text>
              <TouchableOpacity onPress={() => openDatePicker('start')}>
                <Text style={styles.timeText}>
                  {startTime.toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })}
                </Text>
              </TouchableOpacity>

              <Text style={styles.label}>시험 시간 (분)</Text>
              <Picker
                selectedValue={selectedDuration}
                onValueChange={handleDurationChange}
                style={styles.picker}
              >
                {[...Array(86)].map((_, i) => {
                  const minute = 5 + i; // 5분부터 시작
                  return <Picker.Item key={minute} label={`${minute}분`} value={minute} />;
                })}
              </Picker>
            </>
          )}

          {selectType === 'homework' && (
            <>
              <Text style={styles.label}>숙제 시작 시간</Text>
              <TouchableOpacity onPress={() => openDatePicker('start')}>
                <Text style={styles.timeText}>
                  {startTime.toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })}
                </Text>
              </TouchableOpacity>

              <Text style={styles.label}>숙제 종료 시간</Text>
              <TouchableOpacity onPress={() => openDatePicker('end')}>
                <Text style={styles.timeText}>
                  {endTime.toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })}
                </Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
            onPress={handleButtonPress}
            disabled={isButtonDisabled}
          >
            <Text style={styles.buttonText}>
              {isButtonDisabled ? buttonMessage :
                selectType === 'exam'
                  ? '시험 생성'
                  : selectType === 'homework'
                    ? '숙제 생성'
                    : '레슨 생성'}
            </Text>
          </TouchableOpacity>

          {isDatePickerVisible && (
            <DatePicker
              modal
              title={datePickerMode === 'start' ? '시작 시간 설정' : '종료 시간 설정'}
              open={isDatePickerVisible}
              date={datePickerMode === 'start' ? startTime : endTime}
              mode="datetime"
              buttonColor="#2E2559"
              dividerColor="#2E2559"
              onConfirm={handleDateConfirm}
              onCancel={() => setDatePickerVisible(false)}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: borderRadius.lg,
    marginLeft: spacing.lg,
  },
  container: {
    flex: 1,
  },
  topSection: {
    width: '100%',
    flex: 0.6,
    backgroundColor: '#E8F0FF',
    marginBottom: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: borderWidth.sm,
    borderRadius: borderRadius.md,
    borderColor: `${colors.light.background.main}7f`,
    elevation: getResponsiveSize(2),
  },
  exProblemContainer: {
    backgroundColor: 'white',
    height: '100%',
    width: '100%',
    borderRadius: borderRadius.md,
    borderColor: `${colors.light.background.main}7f`,
    elevation: getResponsiveSize(2),
    padding: spacing.lg,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.xl,
    color: colors.light.text.main,
  },
  formContainer: {
    flex: 0.6,
    backgroundColor: 'white',
    padding: spacing.lg,
    borderWidth: borderWidth.sm,
    borderRadius: borderRadius.md,
    borderColor: `${colors.light.background.main}7f`,
    elevation: getResponsiveSize(2),
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    marginBottom: spacing.lg,
    fontSize: 16,
  },
  picker: {
    marginVertical: spacing.md,
  },
  timeText: {
    fontSize: 16,
    color: '#333',
    marginBottom: spacing.lg,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  fileName: {
    fontSize: 14,
    color: '#666',
  },
  removeText: {
    fontSize: 14,
    color: '#FF0000',
    marginLeft: spacing.sm,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  detailText: {
    width: '100%',
    fontSize: 14,
    color: colors.light.text.main,
    marginVertical: spacing.sm,
    fontWeight: 'bold',
  },
});

export default CreateInput;
