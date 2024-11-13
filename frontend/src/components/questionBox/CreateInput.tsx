import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {spacing} from '@theme/spacing';
import {borderRadius} from '@theme/borderRadius';
import {colors} from 'src/hooks/useColors';
import DatePicker from 'react-native-date-picker';
import {getResponsiveSize} from '@utils/responsive';
import {borderWidth} from '@theme/borderWidth';

type CreateInputProps = {
  title: string;
  setTitle: (title: string) => void;
  selectedFiles: string[];
  handleCreateLectureAction: () => void;
  selectType: 'lesson' | 'exam' | 'homework';
  setStartTime?: (time: Date) => void;
  setEndTime?: (time: Date) => void;
};

function CreateInput({
  title,
  setTitle,
  selectedFiles,
  handleCreateLectureAction,
  selectType,
  setStartTime,
  setEndTime,
}: CreateInputProps): React.JSX.Element {
  const getCurrentTime = (): Date => {
    const now = new Date();
    now.setHours(now.getHours() + 9);
    now.setSeconds(0, 0);
    return now;
  };

  const [startTime, setLocalStartTime] = useState<Date>(getCurrentTime());
  const [endTime, setLocalEndTime] = useState<Date>(getCurrentTime());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'start' | 'end'>(
    'start',
  );
  const [selectedDuration, setSelectedDuration] = useState<number>(5);

  const handleDurationChange = (duration: number) => {
    setSelectedDuration(duration);
    const newEndTime = new Date(startTime.getTime() + duration * 60000);
    setLocalEndTime(newEndTime);
    setEndTime?.(newEndTime);
  };

  const openDatePicker = (mode: 'start' | 'end') => {
    setDatePickerMode(mode);
    setDatePickerVisible(true);
  };

  const handleDateConfirm = (selectedDate: Date) => {
    if (datePickerMode === 'start') {
      setLocalStartTime(selectedDate);
      setStartTime?.(selectedDate);
    } else {
      setLocalEndTime(selectedDate);
      setEndTime?.(selectedDate);
    }
    setDatePickerVisible(false);
  };

  return (
    <View style={styles.layout}>
      <View style={styles.container}>
        <View style={styles.topSection}>
          <Text style={styles.sectionTitle}>미리보기 영역</Text>
          {/* 필요한 데이터를 상단에 배치할 수 있는 공간 */}
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>{}</Text>
          <TextInput
            style={styles.input}
            placeholder="수업 제목을 입력하세요"
            value={title}
            onChangeText={setTitle}
          />

          {(selectType === 'exam' || selectType === 'homework') && (
            <>
              {selectType === 'exam' && (
                <>
                  <Text style={styles.label}>시험 시간 (분)</Text>
                  <Picker
                    selectedValue={selectedDuration}
                    onValueChange={handleDurationChange}
                    style={styles.picker}>
                    {[
                      5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75,
                      80, 85, 90,
                    ].map(minute => (
                      <Picker.Item
                        key={minute}
                        label={`${minute}분`}
                        value={minute}
                      />
                    ))}
                  </Picker>
                </>
              )}

              <Text style={styles.label}>
                {selectType === 'exam' ? '시험 종료 시간' : '숙제 종료 시간'}
              </Text>
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

          <Text style={styles.label}>선택된 파일</Text>
          <FlatList
            data={selectedFiles}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => <Text style={styles.fileName}>{item}</Text>}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleCreateLectureAction}>
            <Text style={styles.buttonText}>
              {selectType === 'exam'
                ? '시험 생성'
                : selectType === 'homework'
                ? '숙제 생성'
                : '레슨 생성'}
            </Text>
          </TouchableOpacity>

          {isDatePickerVisible && (
            <DatePicker
              modal
              title="숙제 기간"
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
    flex: 0.6,
    backgroundColor: '#E8F0FF',
    padding: spacing.lg,
    marginBottom: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: borderWidth.sm,
    borderRadius: borderRadius.md,
    borderColor: `${colors.light.background.main}7f`,
    elevation: getResponsiveSize(2),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
  fileName: {
    fontSize: 14,
    paddingVertical: spacing.sm,
    color: '#666',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CreateInput;
