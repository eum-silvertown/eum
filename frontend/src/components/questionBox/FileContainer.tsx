import {StyleSheet, View} from 'react-native';
import FolderIcon from '@assets/icons/folderIcon.svg';
import FilledFolderIcon from '@assets/icons/filledFolderIcon.svg';
import FileIcon from '@assets/icons/fileIcon.svg';
import {Text} from '../common/Text';
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
            width={100}
            height={100}
          />
        ) : (
          <FolderIcon
            opacity={cutFolderId === file.id ? 0.5 : 1}
            width={100}
            height={100}
          />
        )
      ) : (
        <FileIcon width={100} height={100} />
      )}
      <Text>{file.title}</Text>
    </View>
  );
}

export default FileContainer;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 10,
  },
});
