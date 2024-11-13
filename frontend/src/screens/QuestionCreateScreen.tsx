import React, { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import CreateInput from '@components/questionBox/CreateInput';
import {
  createLesson,
  CreateLessonRequest,
  switchLessonStatus,
  SwitchLessonStatusResponse,
} from '@services/lessonService';
import { createExam, CreateExamRequest } from '@services/examService';
import { createHomework, CreateHomeworkRequest } from '@services/homeworkService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
import { colors } from 'src/hooks/useColors';
import { detailQuestion, DetailQuestionType, getFolder, getRootFolder } from 'src/services/questionBox';
import { ScreenType, useCurrentScreenStore } from '@store/useCurrentScreenStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLessonStore } from '@store/useLessonStore';

type NavigationProps = NativeStackNavigationProp<ScreenType>;

function QuestionCreateScreen(): React.JSX.Element {
  const route = useRoute();
  const navigation = useNavigation<NavigationProps>();
  const { lectureId, action } = route.params as {
    lectureId: number;
    action: 'lesson' | 'exam' | 'homework';
  };
  const queryClient = useQueryClient();
  const [selectedFileId, setSelectedFileId] = useState(0);

  const { data: questionDetail } = useQuery<DetailQuestionType>({
    queryKey: ['questionDetail', selectedFileId],
    queryFn: () => detailQuestion(selectedFileId),
    enabled: selectedFileId !== 0,
  });

  const setCurrentScreen = useCurrentScreenStore(
    state => state.setCurrentScreen,
  );
  useFocusEffect(() => {
    setCurrentScreen('QuestionCreateScreen');
  });

  const [title, setTitle] = useState(''); // 제목 상태
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [questionIds, setQuestionIds] = useState<number[]>([]);

  const getCurrentTime = (): Date => {
    const now = new Date();
    // 초와 밀리초를 0으로 설정하여 제거
    now.setSeconds(0, 0);
    return now;
  };

  const [startTime, setStartTime] = useState<Date | null>(getCurrentTime());
  const [selectedDuration, setSelectedDuration] = useState<number>(5);

  const setLessonInfo = useLessonStore(state => state.setLessonInfo);

  // 수업 상태 변경
  const switchLectureStatusMutation = useMutation({
    mutationFn: (moveLectureId: number) => switchLessonStatus(moveLectureId),
    onSuccess: (data: SwitchLessonStatusResponse) => {
      queryClient.invalidateQueries({
        queryKey: ['lectureDetail', lectureId],
      });
      console.log('수업 상태 변경 완료:', data.message);
      Alert.alert('알림', '수업이 시작 되었습니다.');
      navigation.replace('LessoningStudentListScreen');
    },
    onError: error => {
      console.error('수업 상태 변경 실패:', error);
    },
  });
  const handleSwitchLectureStatus = () => {
    switchLectureStatusMutation.mutate(lectureId);
  };

  // Lesson 생성
  const lessonMutation = useMutation({
    mutationFn: (newLessonData: CreateLessonRequest) =>
      createLesson(newLessonData),
    onSuccess: () => {
      console.log('레슨 생성 완료');
      setLessonInfo(lectureId, questionIds);
      handleSwitchLectureStatus();
    },
    onError: error => {
      console.error('레슨 생성 실패:', error);
      Alert.alert('오류', '중복된 제목입니다.');
    },
  });

  // Exam 생성
  const examMutation = useMutation({
    mutationFn: (newExamData: CreateExamRequest) => createExam(newExamData),
    onSuccess: () => {
      console.log('시험 생성 완료');
      queryClient.invalidateQueries({
        queryKey: ['lectureDetail', lectureId],
      });
      navigation.goBack();
      Alert.alert('알림', '시험이 생성되었습니다.');
    },
    onError: error => {
      console.error('시험 생성 실패:', error);
      Alert.alert('오류', '중복된 제목입니다.');
    },
  });

  // Homework 생성
  const homeworkMutation = useMutation({
    mutationFn: (newHomeworkData: CreateHomeworkRequest) =>
      createHomework(newHomeworkData),
    onSuccess: () => {
      console.log('숙제 생성 완료');
      queryClient.invalidateQueries({
        queryKey: ['lectureDetail', lectureId],
      });
      Alert.alert('알림', '숙제가 생성되었습니다.');
      navigation.goBack();
    },
    onError: error => {
      console.error('숙제 생성 실패:', error);
      Alert.alert('오류', '중복된 제목입니다.');
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
    if (!selectedFiles.includes(file.title)) { // 중복 방지
      setSelectedFiles(prevFiles => [...prevFiles, file.title]);
      setQuestionIds(prevIds => [...prevIds, file.id]);
    } else {
      Alert.alert('알림', '이미 선택된 파일입니다.');
    }
  };

  const handleCreateLectureAction = () => {
    if (!title || questionIds.length === 0) {
      Alert.alert('알림', '제목과 파일을 추가해주세요.');
      return;
    }

    const formattedStartTime = startTime ? startTime.toISOString().split('.')[0] : '';
    const calculatedEndTime = new Date(startTime!.getTime() + selectedDuration * 60000);
    const formattedEndTime = calculatedEndTime.toISOString().split('.')[0];

    if (action === 'lesson') {
      lessonMutation.mutate({
        lectureId: lectureId,
        title: title,
        questionIds: questionIds,
      });
    } else if (action === 'exam') {
      examMutation.mutate({
        lectureId: lectureId,
        title: title,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        questionIds: questionIds,
      });
    } else if (action === 'homework') {
      homeworkMutation.mutate({
        lectureId: lectureId,
        title: title,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        questionIds: questionIds,
      });
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
              onPress={() => {
                if (item.type === 'folder') {
                  folderPressHandler(item);
                } else {
                  setSelectedFileId(item.id);
                }
              }}
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
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        handleCreateLectureAction={handleCreateLectureAction}
        selectType={action}
        setStartTime={setStartTime}
        setDuration={setSelectedDuration}
        questionDetail={questionDetail}
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
