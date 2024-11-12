import FileContainer from '@components/questionBox/FileContainer';
import FolderHeader from '@components/questionBox/FolderHeader';
import MoveMenu from '@components/questionBox/MoveMenu';
import { useCutStore } from '@store/useCutStore';
import {
  QuestionBoxType,
  useQuestionExplorerStore,
} from '@store/useQuestionExplorerStore';
import { borderRadius } from '@theme/borderRadius';
import { borderWidth } from '@theme/borderWidth';
import { spacing } from '@theme/spacing';
import { getResponsiveSize } from '@utils/responsive';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors } from 'src/hooks/useColors';
import { getFolder, getRootFolder } from 'src/services/questionBox';
import { useCurrentScreenStore } from '@store/useCurrentScreenStore';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import CreateInput from '@components/questionBox/CreateInput';
import { createLesson, CreateLessonRequest } from '@services/lessonService';
import { useMutation } from '@tanstack/react-query';

import { useLessonStore } from '@store/useLessonStore';

function QuestionCreateScreen(): React.JSX.Element {
  const route = useRoute();
  const { lectureId } = route.params as { lectureId: number };

  const setCurrentScreen = useCurrentScreenStore(
    state => state.setCurrentScreen,
  );
  useFocusEffect(() => {
    setCurrentScreen('QuestionCreateScreen');
  });

  const [title, setTitle] = useState(''); // 제목 상태
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [questionIds, setQuestionIds] = useState<number[]>([]);

  const setLessonInfo = useLessonStore(state => state.setLessonInfo);
  const mutation = useMutation({
    mutationFn: (newLessonData: CreateLessonRequest) =>
      createLesson(newLessonData),
    onSuccess: () => {
      console.log('레슨 생성 완료');
      setLessonInfo(lectureId, questionIds);
    },
    onError: error => {
      console.error('레슨 생성 실패:', error);
    },
  });

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

  const handleFileDrop = (file: QuestionBoxType) => {
    setSelectedFiles(prevFiles => [...prevFiles, file.title]);
    setQuestionIds(prevIds => [...prevIds, file.id]);
  };

  const handleCreateLesson = () => {
    if (title && questionIds.length > 0) {
      mutation.mutate({
        lectureId: lectureId, // 예시로 고정된 lectureId; 실제 데이터로 대체해야 함
        title: title,
        questionIds: questionIds,
      });
    } else {
      console.warn('제목과 파일을 추가해주세요.');
    }
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
              onPress={() => folderPressHandler(item)}
              onLongPress={() => {
                handleFileDrop(item);
              }}
              style={styles.fileItem}>
              <FileContainer file={item} />
            </Pressable>
          ))}
        </View>
      </View>
      <CreateInput
        title={title}
        setTitle={setTitle}
        selectedFiles={selectedFiles} // 파일 제목 전달
        onCreateLesson={handleCreateLesson}
      />
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
    flexDirection: 'row',
  },
  contentContainer: {
    flex: 3,
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

export default QuestionCreateScreen;
