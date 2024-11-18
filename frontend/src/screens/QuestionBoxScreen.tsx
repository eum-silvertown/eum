import FileContainer from '@components/questionBox/FileContainer';
import FileOptionModal from '@components/questionBox/FileOptionModal';
import FolderHeader from '@components/questionBox/FolderHeader';
import MoveMenu from '@components/questionBox/MoveMenu';
import QuestionDetail from '@components/questionBox/QuestionDetail';
import { useCutStore } from '@store/useCutStore';
import {
  QuestionBoxType,
  useQuestionExplorerStore,
} from '@store/useQuestionExplorerStore';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { colors } from '@hooks/useColors';
import { useModal } from '@hooks/useModal';
import { getFolder, getRootFolder } from '@services/questionBox';

function QuestionBoxScreen(): React.JSX.Element {
  const { width } = useWindowDimensions();
  const styles = getStyles(width);

  const { open } = useModal();
  const [isDetailOpened, setIsDetailOpened] = useState(false);
  const [containerHeight, setContainerHeight] = useState(0);
  const [selectedFileId, setSelectedFileId] = useState(0);
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
    <View
      onLayout={event => {
        const { height } = event.nativeEvent.layout;
        console.log(height);
        setContainerHeight(height);
      }}
      style={styles.container}>
      <QuestionDetail
        isOpened={isDetailOpened}
        setIsOpened={setIsDetailOpened}
        containerHeight={containerHeight}
        selectedFileId={selectedFileId}
        setSelectedFileId={setSelectedFileId}
      />
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
                } else {
                  setSelectedFileId(item.id);
                  setIsDetailOpened(true);
                }
              }}
              onLongPress={() => {
                folderLongPressHandler(item);
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

const getStyles = (width: number) =>
  StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
      backgroundColor: '#f0f0f0',
      borderRadius: width * 0.01,
      padding: width * 0.01,
    },
    contentContainer: {
      flex: 1,
      backgroundColor: 'white',
      borderWidth: width * 0.001,
      borderRadius: width * 0.01,
      borderColor: `${colors.light.background.main}7f`,
      elevation: 2,
    },
    fileList: {
      flex: 1,
      flexWrap: 'wrap',
      flexDirection: 'row',
    },
    fileItem: {
      width: '20%',
      paddingVertical: width * 0.015,
    },
  });

export default QuestionBoxScreen;
