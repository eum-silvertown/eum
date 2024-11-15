import Button from '@components/common/Button';
import {useQuestionExplorerStore} from '@store/useQuestionExplorerStore';
import {useState} from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import {useModalContext} from 'src/contexts/useModalContext';
import {colors} from 'src/hooks/useColors';
import {createFolder} from 'src/services/questionBox';

function CreateFolder(): React.JSX.Element {
  const {width} = useWindowDimensions();
  const styles = getStyles(width);

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

const getStyles = (width: number) =>
  StyleSheet.create({
    container: {
      gap: width * 0.01,
      paddingTop: width * 0.01,
    },
    input: {
      padding: width * 0.01,
      borderWidth: width * 0.001,
      borderColor: colors.light.borderColor.cardBorder,
      borderRadius: width * 0.005,
    },
  });
