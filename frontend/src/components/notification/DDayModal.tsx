import { Text } from '@components/common/Text';
import { useModalContext } from '@contexts/useModalContext';
import { colors } from '@hooks/useColors';
import React, { useState } from 'react';
import { View, StyleSheet, TextInput, useWindowDimensions, Pressable, Alert } from 'react-native';

interface DDayModalProps {
  onSave: (title: string, date: string) => void;
}

import DatePicker from 'react-native-date-picker';

function DDayModal({ onSave }: DDayModalProps): React.JSX.Element {
  const { width } = useWindowDimensions();
  const styles = getStyles(width);
  const { close } = useModalContext();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [open, setOpen] = useState(false);

  const handleDateChange = (selectedDate: Date) => {
    setOpen(false);
    const formattedDate = selectedDate.toISOString().split('T')[0];
    setDate(formattedDate);
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('알림', '제목을 입력해주세요.');
      return;
    }

    if (!date) {
      Alert.alert('알림', '날짜를 선택해주세요.');
      return;
    }

    close();
    onSave(title, date);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="제목을 입력하세요"
        value={title}
        onChangeText={setTitle}
      />
      <Pressable onPress={() => setOpen(true)}>
        <TextInput
          style={styles.input}
          placeholder="날짜를 입력하세요 (YYYY-MM-DD)"
          value={date}
          editable={false}
        />
      </Pressable>
      <DatePicker
        modal
        open={open}
        date={date ? new Date(date) : new Date()}
        mode="date"
        onConfirm={handleDateChange}
        onCancel={() => setOpen(false)}
      />
      <Pressable style={styles.button} onPress={handleSave}>
        <Text color="white">저장</Text>
      </Pressable>
    </View>
  );
}

const getStyles = (width: number) => StyleSheet.create({
  container: {
    gap: width * 0.01,
    padding: width * 0.025,
  },
  input: {
    padding: width * 0.01,
    borderWidth: width * 0.001,
    borderRadius: width * 0.0075,
    borderColor: colors.light.borderColor.pickerBorder,
  },
  button: {
    marginTop: width * 0.01,
    alignItems: 'center',
    justifyContent: 'center',
    padding: width * 0.01,
    borderRadius: width * 0.0075,
    backgroundColor: colors.light.background.main,
  },
});

export default DDayModal;
