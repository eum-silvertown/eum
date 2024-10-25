import {Text} from '@components/common/Text';
import FileContainer from '@components/common/questionBox/FileContainer';
import FolderHeader from '@components/common/questionBox/FolderHeader';
import {useQuestionExplorerStore} from '@store/useQuestionExplorerStore';
import {spacing} from '@theme/spacing';
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
      <View style={styles.header}>
        <Text variant="title" weight="bold">
          문제 보관함
        </Text>
      </View>

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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xxl,
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
