import FileContainer from '@components/questionBox/FileContainer';
import FileOptionModal from '@components/questionBox/FileOptionModal';
import FolderHeader from '@components/questionBox/FolderHeader';
import MoveMenu from '@components/questionBox/MoveMenu';
import {useCutStore} from '@store/useCutStore';
import {
  QuestionBoxType,
  useQuestionExplorerStore,
} from '@store/useQuestionExplorerStore';
import {borderRadius} from '@theme/borderRadius';
import {borderWidth} from '@theme/borderWidth';
import {spacing} from '@theme/spacing';
import {getResponsiveSize} from '@utils/responsive';
import React, {useEffect} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {colors} from 'src/hooks/useColors';
import {useModal} from 'src/hooks/useModal';
import {getFolder, getRootFolder} from 'src/services/questionBox';

function QuestionBoxScreen(): React.JSX.Element {
  const {open} = useModal();
  const currentFolder = useQuestionExplorerStore(state => state.currentFolder);
  const updateFolderChildren = useQuestionExplorerStore(
    state => state.updateFolderChildren,
  );
  const navigateToFolder = useQuestionExplorerStore(
    state => state.navigateToFolder,
  );
  const cutFolderId = useCutStore(state => state.folderId);

  const fetchInitialData = async () => {
    try {
      const data = await getRootFolder();
      useQuestionExplorerStore
        .getState()
        .initializeStore(data.id, data.children);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const folderPressHandler = async (item: QuestionBoxType) => {
    navigateToFolder(item);
    try {
      if (item.children.length === 0) {
        const children = await getFolder(item.id);
        updateFolderChildren(item.id, children);
      }
    } catch (error) {
      console.error('Failed to fetch folder children:', error);
    }
  };

  const folderLongPressHandler = (item: QuestionBoxType) => {
    open(<FileOptionModal item={item} />, {
      title: '파일 옵션',
      size: 'xs',
      onClose: () => {
        console.log('파일 옵션 Closed!');
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {cutFolderId !== 0 && <MoveMenu />}
        <FolderHeader />
        <View style={styles.fileList}>
          {currentFolder?.map((item, index) => (
            <Pressable
              key={index}
              onPress={() => {
                if (item.type === 'folder') {
                  folderPressHandler(item);
                }
              }}
              onLongPress={() => {
                if (item.type === 'folder') {
                  folderLongPressHandler(item);
                }
              }}
              style={styles.fileItem}>
              <FileContainer file={item} />
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: borderWidth.sm,
    borderRadius: borderRadius.lg,
    borderColor: `${colors.light.background.main}7f`,
    elevation: getResponsiveSize(2),
  },
  fileList: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  fileItem: {
    width: '20%',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
  },
});

export default QuestionBoxScreen;
