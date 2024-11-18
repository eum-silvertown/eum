import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Text } from '@components/common/Text';
import InputField from '@components/account/InputField';
import { colors } from '@hooks/useColors';
import { useModalContext } from '@contexts/useModalContext';
import { createTodo, updateTodo } from '@services/todoService';

interface AddTodoModalProps {
  onTodoListUpdate?: () => void;
  isEditMode?: boolean;
  todo?: {
    id: number;
    title: string;
    content: string;
    priority: number;
  };
}

const importanceLevels = ['일반', '평범', '중요', '매우 중요'];

// 중요도에 따른 색상 반환 함수
const getCheckBoxColor = (importance: number, isSelected: boolean) => {
  const color = isSelected
    ? { 1: '#4CAF50', 2: '#FF9800', 3: '#F44336' }[importance] || '#2E2559'
    : { 1: '#A5D6A7', 2: '#FFCC80', 3: '#EF9A9A' }[importance] || '#D1C4E9';
  return color;
};

const AddTodoModal = ({
  onTodoListUpdate,

  isEditMode = false,
  todo,
}: AddTodoModalProps): React.JSX.Element => {
  const [title, setTitle] = useState(todo?.title || '');
  const [content, setContent] = useState(todo?.content || '');
  const [selectedImportance, setSelectedImportance] = useState(
    todo?.priority || 0,
  );
  const { close } = useModalContext();

  const [titleStatusText, setTitleStatusText] = useState('');
  const [contentStatusText, setContentStatusText] = useState('');

  const handleSaveTodo = async () => {
    let hasError = false;

    if (!title.trim()) {
      setTitleStatusText('제목을 입력해주세요.');
      hasError = true;
    } else {
      setTitleStatusText('');
    }

    if (!content.trim()) {
      setContentStatusText('내용을 입력해주세요.');
      hasError = true;
    } else {
      setContentStatusText('');
    }

    if (hasError) return;

    try {
      const response = isEditMode
        ? await updateTodo(todo?.id!, {
          title,
          content,
          priority: selectedImportance,
        })
        : await createTodo({ title, content, priority: selectedImportance });

      console.log(isEditMode ? '투두 수정 성공' : '투두 생성 성공', response);

      if (onTodoListUpdate) {
        onTodoListUpdate(); // 정의된 경우에만 호출
      }

      close(); // 모달 닫기
    } catch (error) {
      Alert.alert(
        isEditMode
          ? '할 일 수정에 실패하였습니다.'
          : '할 일 생성을 실패하였습니다.',
      );
    }
  };

  return (
    <View>
      <View style={styles.contentContainer}>
        <InputField
          label="제목"
          placeholder="제목을 입력해주세요."
          value={title}
          onChangeText={setTitle}
          maxLength={20}
          status="error"
          statusText={titleStatusText}
        />
      </View>

      <View style={styles.contentContainer}>
        <Text variant="subtitle" weight="bold">
          중요도
        </Text>
        <View style={styles.importanceLevelContainer}>
          {importanceLevels.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedImportance(index)}
              style={[
                styles.importanceButton,
                {
                  backgroundColor: getCheckBoxColor(
                    index,
                    selectedImportance === index,
                  ),
                },
              ]}>
              <Text color="white" weight="bold" align="center">
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.contentContainer}>
        <InputField
          label="내용"
          placeholder="내용을 입력해주세요."
          value={content}
          onChangeText={setContent}
          maxLength={50}
          status="error"
          statusText={contentStatusText}
        />
      </View>

      <TouchableOpacity onPress={handleSaveTodo} style={styles.submitButton}>
        <Text color="white" weight="bold" align="center">
          {isEditMode ? '수정' : '생성'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    marginBottom: 25,
  },
  importanceLevelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 5,
  },
  importanceButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: colors.light.background.main,
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
});

export default AddTodoModal;
