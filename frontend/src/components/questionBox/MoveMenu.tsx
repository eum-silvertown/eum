import Button from '@components/common/Button';
import {Text} from '@components/common/Text';
import {useCutStore} from '@store/useCutStore';
import {useQuestionExplorerStore} from '@store/useQuestionExplorerStore';
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
        <Text style={{marginRight: 15}}>폴더</Text>
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
    bottom: 25,
    left: 25,
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderWidth: 1,
    borderColor: colors.light.borderColor.cardBorder,
    borderRadius: 10,
  },
});
