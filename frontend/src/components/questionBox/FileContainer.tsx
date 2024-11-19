import {StyleSheet, useWindowDimensions, View} from 'react-native';
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
  const {width} = useWindowDimensions();
  const styles = getStyles(width);

  const cutFolderId = useCutStore(state => state.folderId);
  return (
    <View style={styles.container}>
      {file.type === 'folder' ? (
        file.childrenCount > 0 ? (
          <FilledFolderIcon
            opacity={cutFolderId === file.id ? 0.5 : 1}
            width={width * 0.05}
            height={width * 0.05}
          />
        ) : (
          <FolderIcon
            opacity={cutFolderId === file.id ? 0.5 : 1}
            width={width * 0.05}
            height={width * 0.05}
          />
        )
      ) : (
        <FileIcon width={width * 0.05} height={width * 0.05} />
      )}
      <Text>{file.title}</Text>
    </View>
  );
}

export default FileContainer;

const getStyles = (width: number) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      gap: width * 0.005,
    },
  });
