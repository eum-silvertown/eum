import {Pressable, StyleSheet, TouchableOpacity, View} from 'react-native';
import BackArrowIcon from '@assets/icons/backArrowIcon.svg';
import UpArrowIcon from '@assets/icons/backArrowIcon.svg';
import SearchIcon from '@assets/icons/searchIcon.svg';
import AddFolderIcon from '@assets/icons/addFolderIcon.svg';
import {iconSize} from '@theme/iconSize';
import BreadCrumb from '@components/questionBox/BreadCrumb';
import {spacing} from '@theme/spacing';
import {useQuestionExplorerStore} from '@store/useQuestionExplorerStore';
import CreateFolder from './CreateFolder';
import {useModal} from 'src/hooks/useModal';

function FolderHeader(): React.JSX.Element {
  const currentHistoryIndex = useQuestionExplorerStore(
    state => state.currentHistoryIndex,
  );
  const history = useQuestionExplorerStore(state => state.history);
  const currentPath = useQuestionExplorerStore(state => state.currentPath);
  const {navigateBack, navigateForward, navigateUp} =
    useQuestionExplorerStore();
  const {open} = useModal();

  const openModal = () => {
    open(<CreateFolder />, {
      title: '폴더 생성',
      size: 'xs',
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
          <BackArrowIcon width={iconSize.md} height={iconSize.md} />
        </Pressable>

        <Pressable
          onPress={navigateForward}
          style={[
            styles.navButton,
            currentHistoryIndex >= history.length - 1 &&
              styles.navButtonDisabled,
          ]}>
          <BackArrowIcon
            width={iconSize.md}
            height={iconSize.md}
            style={styles.forwardIcon}
          />
        </Pressable>

        <Pressable
          onPress={navigateUp}
          style={[
            styles.navButton,
            {marginLeft: spacing.lg},
            currentPath.length === 0 && styles.navButtonDisabled,
          ]}>
          <UpArrowIcon
            width={iconSize.sm}
            height={iconSize.sm}
            style={styles.upIcon}
          />
        </Pressable>
      </View>

      <BreadCrumb />

      <View style={styles.rightIcons}>
        <SearchIcon width={iconSize.md} height={iconSize.md} />
        <TouchableOpacity
          onPress={() => {
            openModal();
          }}>
          <AddFolderIcon width={iconSize.md} height={iconSize.md} />
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
    height: spacing.xxl,
    marginBottom: spacing.xxl,
    paddingHorizontal: spacing.lg,
    gap: spacing.xl,
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  navButton: {
    padding: spacing.sm,
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
    gap: spacing.lg,
    marginLeft: 'auto',
  },
});
