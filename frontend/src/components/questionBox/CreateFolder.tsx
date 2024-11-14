import Button from '@components/common/Button';
import {useQuestionExplorerStore} from '@store/useQuestionExplorerStore';
import {useState} from 'react';
import {Pressable, StyleSheet, TextInput, View} from 'react-native';
import {useModalContext} from 'src/contexts/useModalContext';
import {colors} from 'src/hooks/useColors';
import {createFolder} from 'src/services/questionBox';

function CreateFolder(): React.JSX.Element {
  const [folderName, setFolderName] = useState('');
  const {createItem, getCurrentFolderId} = useQuestionExplorerStore();
  const {close} = useModalContext();

  const onChangeText = (inputText: string) => {
    setFolderName(inputText);
  };

  const onPress = async () => {
    const parentId = getCurrentFolderId();
    console.log('title: ', folderName, ' parentId: ', parentId);
    try {
      const data = await createFolder(folderName, parentId);
      createItem(data);
      close();
    } catch (error) {
      console.error(error);
      close();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={onChangeText}
        value={folderName}
        placeholder="이름을 입력하세요."
        keyboardType="default"
        style={styles.input}
      />
      <Pressable onPress={onPress}>
        <Button
          onPress={onPress}
          content="생성 완료"
          variant="pressable"
          size="full"
        />
      </Pressable>
    </View>
  );
}

export default CreateFolder;

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
    fontSize: 15,
  },
});
