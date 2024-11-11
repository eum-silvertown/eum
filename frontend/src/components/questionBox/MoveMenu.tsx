import Button from '@components/common/Button';
import {Text} from '@components/common/Text';
import {useCutStore} from '@store/useCutStore';
import {useQuestionExplorerStore} from '@store/useQuestionExplorerStore';
import {borderRadius} from '@theme/borderRadius';
import {borderWidth} from '@theme/borderWidth';
import {spacing} from '@theme/spacing';
import {StyleSheet, View} from 'react-native';
import {colors} from 'src/hooks/useColors';
import {moveFolder, moveQuestion} from 'src/services/questionBox';

function MoveMenu(): React.JSX.Element {
  const title = useCutStore(state => state.title);
  const cutFolderId = useCutStore(state => state.folderId);
  const fileType = useCutStore(state => state.type);
  const setFolder = useCutStore(state => state.setFolder);
  const moveItem = useQuestionExplorerStore(state => state.moveItem);
  const getCurrentFolderId = useQuestionExplorerStore(
    state => state.getCurrentFolderId,
  );

  const pressButtonHandler = async () => {
    const currentFolderId = getCurrentFolderId();
    try {
      if (fileType === 'folder') {
        await moveFolder(cutFolderId, currentFolderId);
      } else {
        await moveQuestion(cutFolderId, currentFolderId);
      }
      moveItem(cutFolderId, currentFolderId);
      setFolder('', 0, 'folder');
    } catch (error) {
      console.error('Failed to moveFolder');
    }
  };

  return (
    <View style={styles.area}>
      <View style={styles.container}>
        <Text weight="bold">{title}</Text>
        <Text style={{marginRight: spacing.lg}}>폴더</Text>
        <Button
          onPress={pressButtonHandler}
          variant="pressable"
          content="여기로 이동"
          size="sm"
        />
      </View>
    </View>
  );
}

export default MoveMenu;

const styles = StyleSheet.create({
  area: {
    alignItems: 'center',
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.xl,
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderWidth: borderWidth.sm,
    borderColor: colors.light.borderColor.cardBorder,
    borderRadius: borderRadius.md,
  },
});
