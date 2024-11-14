import {Text} from '@components/common/Text';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useModalContext} from 'src/contexts/useModalContext';
import {colors} from 'src/hooks/useColors';
import {useModal} from 'src/hooks/useModal';
import RenameFile from './RenameFolder';
import {
  QuestionBoxType,
  useQuestionExplorerStore,
} from '@store/useQuestionExplorerStore';
import {deleteFolder, deleteQuestion} from 'src/services/questionBox';
import {useCutStore} from '@store/useCutStore';

interface FileOptionModalProp {
  item: QuestionBoxType;
}

function FileOptionModal({item}: FileOptionModalProp): React.JSX.Element {
  const {open} = useModal();
  const {close} = useModalContext();
  const deleteItem = useQuestionExplorerStore(state => state.deleteItem);
  const setFolder = useCutStore(state => state.setFolder);

  const fileRenameHandler = () => {
    close();
    open(<RenameFile item={item} />, {
      title: '이름 변경',
      size: 'xs',
      onClose: () => {
        console.log('이름 변경 Closed!');
      },
    });
  };

  const fileMoveHandler = () => {
    setFolder(item.title, item.id, item.type);
    close();
  };

  const fileDeleteHandler = async () => {
    try {
      if (item.type === 'folder') {
        await deleteFolder(item.id);
      } else {
        await deleteQuestion(item.id);
      }
      deleteItem(item.id);
      console.log('폴더가 삭제되었습니다.');
    } catch (error) {
      console.error('Failed to delete Folder', error);
    } finally {
      close();
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.option}>
        <TouchableOpacity onPress={fileRenameHandler}>
          <Text color="main" weight="medium">
            이름 변경
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.option}>
        <TouchableOpacity onPress={fileMoveHandler}>
          <Text color="main" weight="medium">
            파일 이동
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.option}>
        <TouchableOpacity onPress={fileDeleteHandler}>
          <Text color="error" weight="medium">
            파일 삭제
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default FileOptionModal;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 25,
    paddingHorizontal: 10,
  },
  option: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: colors.light.borderColor.cardBorder,
  },
});
