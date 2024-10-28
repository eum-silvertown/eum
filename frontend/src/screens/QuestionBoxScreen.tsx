import ScreenInfo from '@components/common/ScreenInfo';
import FileContainer from '@components/questionBox/FileContainer';
import FolderHeader from '@components/questionBox/FolderHeader';
import {useQuestionExplorerStore} from '@store/useQuestionExplorerStore';
import {borderRadius} from '@theme/borderRadius';
import {spacing} from '@theme/spacing';
import {getResponsiveSize} from '@utils/responsive';
import React, {useEffect} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

function QuestionBoxScreen(): React.JSX.Element {
  const currentFolder = useQuestionExplorerStore(state => state.currentFolder);
  const navigateToFolder = useQuestionExplorerStore(
    state => state.navigateToFolder,
  );

  useEffect(() => {
    useQuestionExplorerStore.getState().initializeStore();
  }, []);

  return (
    <View style={styles.container}>
      <ScreenInfo title="문제 보관함" />
      <View style={styles.contentContainer}>
        <FolderHeader />
        <View style={styles.fileList}>
          {currentFolder.map(item => (
            <Pressable
              key={item.id}
              onPress={() => {
                if (item.type === 'folder') {
                  navigateToFolder(item);
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
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xxl,
  },
  contentContainer: {
    flex: 1,
    padding: spacing.xl,
    backgroundColor: 'white',
    borderRadius: borderRadius.lg,
    elevation: getResponsiveSize(2),
  },
  header: {
    marginBottom: spacing.lg,
  },
  fileList: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.xl,
  },
  fileItem: {
    width: '20%',
    padding: spacing.md,
  },
});

export default QuestionBoxScreen;
