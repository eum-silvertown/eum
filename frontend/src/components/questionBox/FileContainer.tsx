import {StyleSheet, View} from 'react-native';
import FolderIcon from '@assets/icons/folderIcon.svg';
import FilledFolderIcon from '@assets/icons/filledFolderIcon.svg';
import FileIcon from '@assets/icons/fileIcon.svg';
import {iconSize} from '@theme/iconSize';
import {Text} from '../common/Text';
import {spacing} from '@theme/spacing';
import {QuestionBoxType} from '@store/useQuestionExplorerStore';

interface FileContainerProps {
  file: QuestionBoxType;
}

function FileContainer({file}: FileContainerProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      {file.type === 'folder' ? (
        file.children ? (
          <FilledFolderIcon width={iconSize.xxl} height={iconSize.xxl} />
        ) : (
          <FolderIcon width={iconSize.xxl} height={iconSize.xxl} />
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
