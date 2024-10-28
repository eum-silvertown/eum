import {StyleSheet, View} from 'react-native';
import FolderIcon from '@assets/icons/folderIcon.svg';
import FileIcon from '@assets/icons/fileIcon.svg';
import {iconSize} from '@theme/iconSize';
import {Text} from '../Text';
import {spacing} from '@theme/spacing';
import {QuestionBoxType} from '@store/useQuestionExplorerStore';

interface FileContainerProps {
  file: QuestionBoxType;
}

function FileContainer({file}: FileContainerProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      {file.type === 'folder' ? (
        <FolderIcon width={iconSize.xl} height={iconSize.xl} />
      ) : (
        <FileIcon width={iconSize.xl} height={iconSize.xl} />
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
