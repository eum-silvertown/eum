import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { spacing } from '@theme/spacing';
import { borderRadius } from '@theme/borderRadius';
import { borderWidth } from '@theme/borderWidth';
import { colors } from 'src/hooks/useColors';
import { getResponsiveSize } from '@utils/responsive';
import DatePicker from 'react-native-date-picker';

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
  const [datePickerMode, setDatePickerMode] = useState<'start' | 'end'>('start');
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
    <View style={styles.container}>
      <Text style={styles.label}>수업 제목</Text>
      <TextInput
        style={styles.input}
        placeholder="수업 제목을 입력하세요"
        value={title}
        onChangeText={setTitle}
      />

      {(selectType === 'exam' || selectType === 'homework') && (
        <>
          <Text style={styles.label}>
            {selectType === 'exam' ? '시험 시작 시간' : '숙제 시작 시간'}
          </Text>
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

          {selectType === 'exam' && (
            <>
              <Text style={styles.label}>시험 시간 (분)</Text>
              <Picker
                selectedValue={selectedDuration}
                onValueChange={handleDurationChange}
                style={styles.picker}
              >
                {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90].map(
                  (minute) => (
                    <Picker.Item key={minute} label={`${minute}분`} value={minute} />
                  )
                )}
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
        renderItem={({ item }) => <Text style={styles.fileName}>{item}</Text>}
      />

      <TouchableOpacity style={styles.button} onPress={handleCreateLectureAction}>
        <Text style={styles.buttonText}>
          {selectType === 'exam' ? '시험 생성' : selectType === 'homework' ? '숙제 생성' : '레슨 생성'}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: borderWidth.sm,
    borderRadius: borderRadius.lg,
    borderColor: `${colors.light.background.main}7f`,
    elevation: getResponsiveSize(2),
    padding: spacing.md,
    marginLeft: spacing.md,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  fileName: {
    fontSize: 14,
    paddingVertical: spacing.xs,
    color: '#333',
  },
  button: {
    marginTop: spacing.md,
    backgroundColor: '#4CAF50',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  picker: {
    marginVertical: spacing.md,
  },
  timeText: {
    fontSize: 16,
    color: '#333',
    marginBottom: spacing.md,
  },
  datetimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default CreateInput;
