import {Pressable, StyleSheet, TouchableOpacity, View} from 'react-native';
import BackArrowIcon from '@assets/icons/backArrowIcon.svg';
import UpArrowIcon from '@assets/icons/backArrowIcon.svg';
// import SearchIcon from '@assets/icons/searchIcon.svg';
import AddFolderIcon from '@assets/icons/addFolderIcon.svg';
import AddQuestionIcon from '@assets/icons/addQuestionIcon.svg';
import {iconSize} from '@theme/iconSize';
import BreadCrumb from '@components/questionBox/BreadCrumb';
import {spacing} from '@theme/spacing';
import {useQuestionExplorerStore} from '@store/useQuestionExplorerStore';
import CreateFolder from './CreateFolder';
import {useModal} from 'src/hooks/useModal';
import {borderWidth} from '@theme/borderWidth';
import {borderRadius} from '@theme/borderRadius';
import {getResponsiveSize} from '@utils/responsive';
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
        {/* 검색 아이콘 */}
        {/* <SearchIcon width={iconSize.md} height={iconSize.md} /> */}
        <TouchableOpacity
          onPress={() => {
            openFolderCreateModal();
          }}>
          <AddFolderIcon width={iconSize.md} height={iconSize.md} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            openQuestionCreateModal();
          }}>
          <AddQuestionIcon
            width={iconSize.md}
            height={iconSize.md}
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
    height: spacing.xxl * 1.25,
    gap: spacing.xl,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    backgroundColor: 'white',
    borderBottomWidth: borderWidth.sm,
    borderTopRightRadius: borderRadius.lg,
    borderTopLeftRadius: borderRadius.lg,
    borderColor: `${colors.light.background.main}7f`,
    elevation: getResponsiveSize(2),
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
