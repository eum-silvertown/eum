import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {Text} from '@components/common/Text';
import ModalLayout from '@components/common/ModalLayout';
import InputField from '@components/account/InputField';
import {spacing} from '@theme/spacing';
import {colors} from 'src/hooks/useColors';
import ColorPicker from '@components/lectureList/ColorPicker';
import {Picker} from '@react-native-picker/picker';
import AddCircleIcon from '@assets/icons/addCircleIcon.svg';
import {iconSize} from '@theme/iconSize';
import {borderRadius} from '@theme/borderRadius';
import { borderWidth } from '@theme/borderWidth';

interface AddLectureModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate?: (title: string, year: string, semester: string) => void;
}

interface Schedule {
  day: string;
  period: string;
}
const AddLectureModal = ({
  visible,
  onClose,
  onCreate,
}: AddLectureModalProps): React.JSX.Element => {
  const [title, setTitle] = useState('');
  const [subjects, setSubjects] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [coverColor, setCoverColor] = useState('#FFFFFF');
  const [fontColor, setFontColor] = useState('#000000FF');
  const [isColorPickerVisible, setColorPickerVisible] = useState(false);
  const [activePicker, setActivePicker] = useState<'cover' | 'font'>('cover');
  const colorPickerRef = useRef(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    if (visible) {
      const currentYear = new Date().getFullYear().toString();
      const currentSemester = new Date().getMonth() < 6 ? '1' : '2';
      setYear(currentYear);
      setSemester(currentSemester);
      setTitle('');
      setYear(new Date().getFullYear().toString());
      setSemester(new Date().getMonth() < 6 ? '1' : '2');
      setCoverColor('#FFFFFF');
      setFontColor('#000000FF');
      setSubjects('');
      setSchedules([]); // 스케줄 초기화
    }
  }, [visible]);

  const handleCreate = () => {
    if (onCreate) {
      onCreate(title, year, semester);
    }
    onClose();
  };

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
      setSchedules([...schedules, {day: '', period: ''}]); // 새 요일과 교시 선택 객체 추가
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

  return (
    <View style={styles.container}>
      <ModalLayout visible={visible} onClose={onClose} title="새 수업 생성">
        <View style={styles.content}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text variant="subtitle" weight="bold">
              수업 제목
            </Text>
            <Text variant="subtitle" weight="bold">
              {year}년 {semester}학기
            </Text>
          </View>
          <InputField
            placeholder="수업 제목을 입력해주세요."
            value={title}
            onChangeText={setTitle}
          />

          <Text variant="subtitle" weight="bold">
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
          </View>

          <Text variant="subtitle" weight="bold">
            수업 소개
          </Text>
          <InputField
            placeholder="수업 내용을 입력해주세요."
            value={introduction}
            onChangeText={setIntroduction}           
            multiline={true} 
          />

          <Text variant="subtitle" weight="bold">
            색상 선택
          </Text>

          <View style={styles.colorContainer}>
            <TouchableOpacity
              onPress={() => openColorPicker('cover')}
              style={styles.colorButton}>
              <Text weight="bold">표지 색상 선택</Text>
              <View style={styles.currentColorContainer}>
                <Text>
                  현재 선택된 색상 :{' '}
                  <Text style={[styles.currentColorFont, {color: coverColor}]}>
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
                  <Text style={[styles.currentColorFont, {color: fontColor}]}>
                    {fontColor.toUpperCase()}
                  </Text>
                </Text>
                <View style={[styles.colorBox, {backgroundColor: fontColor}]} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text variant="subtitle" weight="bold">
              수업 시간표
            </Text>
            <TouchableOpacity onPress={addPickerSet}>
              <AddCircleIcon width={iconSize.lg} height={iconSize.lg} />
            </TouchableOpacity>
          </View>

          {/* 추가된 요일 및 교시 Picker 렌더링 */}

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
            </View>
          ))}

          <TouchableOpacity onPress={handleCreate} style={styles.createButton}>
            <Text weight="bold">생성</Text>
          </TouchableOpacity>
        </View>

        {/* 색상 선택 모달 */}
        {isColorPickerVisible && (
          <ModalLayout
            visible={isColorPickerVisible}
            onClose={closeColorPicker}
            title={
              activePicker === 'cover'
                ? '표지 색상 선택'
                : '표지 글자 색상 선택'
            }>
            <View style={styles.colorPicker}>
              <ColorPicker
                ref={colorPickerRef}
                initialColor={activePicker === 'cover' ? coverColor : fontColor}
                onColorSelected={color => confirmColorSelection(color)}
              />
            </View>
          </ModalLayout>
        )}
      </ModalLayout>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    gap: spacing.md,
  },
  createButton: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  colorButton: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButton: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  colorPickerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  colorPicker: {
    flex: 1,
  },
  colorContainer: {
    borderWidth: borderWidth.sm,
    borderColor: colors.light.borderColor.cardBorder,
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  colorBox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
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
  pickerSet: {
    borderWidth: borderWidth.sm,
    borderColor: colors.light.borderColor.cardBorder,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  picker: {
    borderWidth: borderWidth.sm,
    borderColor: colors.light.borderColor.cardBorder,
    flex: 1,
    marginHorizontal: 4,
  },

  scrollViewContent: {
    paddingBottom: spacing.md, // 추가 여백
  },
});

export default AddLectureModal;
