import Button from '@components/common/Button';
import {useQuestionExplorerStore} from '@store/useQuestionExplorerStore';
import {borderRadius} from '@theme/borderRadius';
import {borderWidth} from '@theme/borderWidth';
import {spacing} from '@theme/spacing';
import {typography} from '@theme/typography';
import {useState} from 'react';
import {Pressable, StyleSheet, TextInput, View} from 'react-native';
import {useModalContext} from 'src/contexts/useModalContext';
import {colors} from 'src/hooks/useColors';
import {createFolder} from 'src/services/questionBox';

function CreateFolder(): React.JSX.Element {
  const [folderName, setFolderName] = useState('');
  const {getCurrentParentId} = useQuestionExplorerStore();
  const {close} = useModalContext();

  const onChangeText = (inputText: string) => {
    setFolderName(inputText);
  };

  const onPress = async () => {
    console.log('title: ', folderName, ' parentId: ', getCurrentParentId());
    try {
      const data = await createFolder(folderName, getCurrentParentId());
      console.log(data);
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
    gap: spacing.xl,
    paddingTop: spacing.xl,
  },
  input: {
    padding: spacing.lg,
    borderWidth: borderWidth.sm,
    borderColor: colors.light.borderColor.cardBorder,
    borderRadius: borderRadius.md,
    fontSize: typography.size.body,
  },
});
