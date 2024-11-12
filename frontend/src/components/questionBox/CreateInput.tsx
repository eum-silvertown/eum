import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {spacing} from '@theme/spacing';
import {borderRadius} from '@theme/borderRadius';

type CreateInputProps = {
  title: string;
  setTitle: (title: string) => void;
  selectedFiles: string[];
  onCreateLesson: () => void;
};

function CreateInput({
  title,
  setTitle,
  selectedFiles,
  onCreateLesson,
}: CreateInputProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>수업 제목</Text>
      <TextInput
        style={styles.input}
        placeholder="수업 제목을 입력하세요"
        value={title}
        onChangeText={setTitle}
      />
      <Text style={styles.label}>선택된 파일</Text>
      <FlatList
        data={selectedFiles}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => <Text style={styles.fileName}>{item}</Text>}
      />
      {/* 하단 추가 버튼 */}
      <TouchableOpacity style={styles.button} onPress={onCreateLesson}>
        <Text style={styles.buttonText}>레슨 생성</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: '#f7f7f7',
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
});

export default CreateInput;
