import Button from '@components/common/Button';
import {
  QuestionBoxType,
  useQuestionExplorerStore,
} from '@store/useQuestionExplorerStore';
import {borderRadius} from '@theme/borderRadius';
import {borderWidth} from '@theme/borderWidth';
import {spacing} from '@theme/spacing';
import {typography} from '@theme/typography';
import {useState} from 'react';
import {Pressable, StyleSheet, TextInput, View} from 'react-native';
import {useModalContext} from 'src/contexts/useModalContext';
import {colors} from 'src/hooks/useColors';
import {renameFolder} from 'src/services/questionBox';

interface RenameFolderProp {
  item: QuestionBoxType;
}

function RenameFolder({item}: RenameFolderProp): React.JSX.Element {
  const {close} = useModalContext();
  const renameItem = useQuestionExplorerStore(state => state.renameItem);
  const [folderName, setFolderName] = useState(item.title);

  const onChangeText = (inputText: string) => {
    setFolderName(inputText);
  };

  const onPress = async () => {
    try {
      const newTitle = await renameFolder(item.id, folderName);
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
        value={folderName}
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

export default RenameFolder;

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
