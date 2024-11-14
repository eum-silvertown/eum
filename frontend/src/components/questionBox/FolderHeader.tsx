import {Pressable, StyleSheet, TouchableOpacity, View} from 'react-native';
import BackArrowIcon from '@assets/icons/backArrowIcon.svg';
import UpArrowIcon from '@assets/icons/backArrowIcon.svg';
import AddFolderIcon from '@assets/icons/addFolderIcon.svg';
import AddQuestionIcon from '@assets/icons/addQuestionIcon.svg';
import BreadCrumb from '@components/questionBox/BreadCrumb';
import {useQuestionExplorerStore} from '@store/useQuestionExplorerStore';
import CreateFolder from './CreateFolder';
import {useModal} from 'src/hooks/useModal';
import {colors} from 'src/hooks/useColors';
import CreateQuestionModal from './CreateQuestionModal';

function FolderHeader(): React.JSX.Element {
  const currentHistoryIndex = useQuestionExplorerStore(
    state => state.currentHistoryIndex,
  );
  const history = useQuestionExplorerStore(state => state.history);
  const currentPath = useQuestionExplorerStore(state => state.currentPath);
  const {navigateBack, navigateForward, navigateUp} =
    useQuestionExplorerStore();
  const {open} = useModal();

  const openFolderCreateModal = () => {
    open(<CreateFolder />, {
      title: '폴더 생성',
      size: 'xs',
    });
  };

  const openQuestionCreateModal = () => {
    open(<CreateQuestionModal />, {
      title: '문제 생성',
      size: 'md',
    });
  };

  return (
    <View style={styles.folderHeader}>
      <View style={styles.navigationButtons}>
        <Pressable
          onPress={navigateBack}
          style={[
            styles.navButton,
            currentHistoryIndex <= 0 && styles.navButtonDisabled,
          ]}>
          <BackArrowIcon width={30} height={30} />
        </Pressable>

        <Pressable
          onPress={navigateForward}
          style={[
            styles.navButton,
            currentHistoryIndex >= history.length - 1 &&
              styles.navButtonDisabled,
          ]}>
          <BackArrowIcon width={30} height={30} style={styles.forwardIcon} />
        </Pressable>

        <Pressable
          onPress={navigateUp}
          style={[
            styles.navButton,
            {marginLeft: 15},
            currentPath.length === 0 && styles.navButtonDisabled,
          ]}>
          <UpArrowIcon width={30} height={30} style={styles.upIcon} />
        </Pressable>
      </View>

      <BreadCrumb />

      <View style={styles.rightIcons}>
        <TouchableOpacity
          onPress={() => {
            openFolderCreateModal();
          }}>
          <AddFolderIcon width={30} height={30} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            openQuestionCreateModal();
          }}>
          <AddQuestionIcon
            width={30}
            height={30}
            color={colors.light.background.main}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default FolderHeader;

const styles = StyleSheet.create({
  folderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    gap: 25,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    borderColor: `${colors.light.background.main}7f`,
    elevation: 2,
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  navButton: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  forwardIcon: {
    transform: [{rotate: '180deg'}],
  },
  upIcon: {
    transform: [{rotate: '90deg'}],
  },
  rightIcons: {
    flexDirection: 'row',
    gap: 15,
    marginLeft: 'auto',
  },
});
