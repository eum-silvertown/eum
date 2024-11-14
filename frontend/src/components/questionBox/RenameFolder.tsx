import Button from '@components/common/Button';
import {
  QuestionBoxType,
  useQuestionExplorerStore,
} from '@store/useQuestionExplorerStore';
import {useState} from 'react';
import {Pressable, StyleSheet, TextInput, View} from 'react-native';
import {useModalContext} from 'src/contexts/useModalContext';
import {colors} from 'src/hooks/useColors';
import {renameFolder, renameQuestion} from 'src/services/questionBox';

interface RenameFolderProp {
  item: QuestionBoxType;
}

function RenameFile({item}: RenameFolderProp): React.JSX.Element {
  const {close} = useModalContext();
  const renameItem = useQuestionExplorerStore(state => state.renameItem);
  const [fileName, setFileName] = useState(item.title);

  const onChangeText = (inputText: string) => {
    setFileName(inputText);
  };

  const onPress = async () => {
    try {
      const newTitle =
        item.type === 'folder'
          ? await renameFolder(item.id, fileName)
          : await renameQuestion(item.id, fileName);
      renameItem(item.id, newTitle);
      close();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={onChangeText}
        value={fileName}
        placeholder="이름을 입력하세요."
        keyboardType="default"
        style={styles.input}
      />
      <Pressable onPress={onPress}>
        <Button
          onPress={onPress}
          content="변경"
          variant="pressable"
          size="full"
        />
      </Pressable>
    </View>
  );
}

export default RenameFile;

const styles = StyleSheet.create({
  container: {
    gap: 25,
    paddingTop: 25,
  },
  input: {
    padding: 15,
    borderWidth: 1,
    borderColor: colors.light.borderColor.cardBorder,
    borderRadius: 10,
    fontSize: 16,
  },
});
