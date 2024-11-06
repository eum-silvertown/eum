import {StyleSheet, View} from 'react-native';
import FolderIcon from '@assets/icons/folderIcon.svg';
import FilledFolderIcon from '@assets/icons/filledFolderIcon.svg';
import FileIcon from '@assets/icons/fileIcon.svg';
import {iconSize} from '@theme/iconSize';
import {Text} from '../common/Text';
import {spacing} from '@theme/spacing';
import {QuestionBoxType} from '@store/useQuestionExplorerStore';
import {useCutStore} from '@store/useCutStore';

interface FileContainerProps {
  file: QuestionBoxType;
}

function FileContainer({file}: FileContainerProps): React.JSX.Element {
  const cutFolderId = useCutStore(state => state.folderId);
  return (
    <View style={styles.container}>
      {file.type === 'folder' ? (
        file.childrenCount > 0 ? (
          <FilledFolderIcon
            opacity={cutFolderId === file.id ? 0.5 : 1}
            width={iconSize.xxl}
            height={iconSize.xxl}
          />
        ) : (
          <FolderIcon
            opacity={cutFolderId === file.id ? 0.5 : 1}
            width={iconSize.xxl}
            height={iconSize.xxl}
          />
        )
      ) : (
        <FileIcon width={iconSize.xxl} height={iconSize.xxl} />
      )}
      <Text>{file.title}</Text>
    </View>
  );
}

export default FileContainer;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.md,
  },
});
