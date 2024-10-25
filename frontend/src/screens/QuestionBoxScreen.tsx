import {Text} from '@components/common/Text';
import FileContainer from '@components/common/questionBox/FileContainer';
import {spacing} from '@theme/spacing';
import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import BackArrowIcon from '@assets/icons/backArrowIcon.svg';
import UpArrowIcon from '@assets/icons/backArrowIcon.svg';
import SearchIcon from '@assets/icons/searchIcon.svg';
import AddFolderIcon from '@assets/icons/addFolderIcon.svg';
import {iconSize} from '@theme/iconSize';

export type QuestionBoxType = {
  id: number;
  type: 'folder' | 'file';
  parentId: number | null;
  title: string;
  children?: QuestionBoxType[];
};

type HistoryEntry = {
  folder: QuestionBoxType[];
  path: QuestionBoxType[];
};

function QuestionBoxScreen(): React.JSX.Element {
  const [questionBox, setQuestionBox] = useState<QuestionBoxType[]>([]);
  const [currentPath, setCurrentPath] = useState<QuestionBoxType[]>([]);
  const [currentFolder, setCurrentFolder] = useState<QuestionBoxType[]>([]);

  // 히스토리 관련 상태
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);

  useEffect(() => {
    const initialData: QuestionBoxType[] = [
      {
        id: 1,
        type: 'folder',
        parentId: 0,
        title: '다항식의 연산',
        children: [
          {
            id: 2,
            type: 'folder',
            parentId: 1,
            title: '항식이의 연산',
            children: [
              {
                id: 3,
                type: 'file',
                parentId: 2,
                title: '7번 문제',
              },
            ],
          },
        ],
      },
      {
        id: 4,
        type: 'folder',
        parentId: 0,
        title: '다항식의 연산',
        children: [
          {
            id: 5,
            type: 'folder',
            parentId: 4,
            title: '항식이의 연산',
            children: [
              {
                id: 6,
                type: 'file',
                parentId: 5,
                title: '7번 문제',
              },
            ],
          },
        ],
      },
    ];

    setQuestionBox(initialData);
    setCurrentFolder(initialData);

    // 초기 상태를 히스토리에 추가
    setHistory([{folder: initialData, path: []}]);
    setCurrentHistoryIndex(0);
  }, []);

  // 새로운 히스토리 항목 추가
  const addToHistory = (
    newFolder: QuestionBoxType[],
    newPath: QuestionBoxType[],
  ) => {
    const newHistoryEntry = {folder: newFolder, path: newPath};

    // 현재 위치 이후의 기록은 제거하고 새로운 기록 추가
    const newHistory = [
      ...history.slice(0, currentHistoryIndex + 1),
      newHistoryEntry,
    ];
    setHistory(newHistory);
    setCurrentHistoryIndex(newHistory.length - 1);
  };

  // 폴더 진입 처리
  const handleFolderPress = (folder: QuestionBoxType) => {
    if (folder.children) {
      const newPath = [...currentPath, folder];
      setCurrentPath(newPath);
      setCurrentFolder(folder.children);
      addToHistory(folder.children, newPath);
    }
  };

  // 뒤로 가기
  const handleBack = () => {
    if (currentHistoryIndex > 0) {
      const prevIndex = currentHistoryIndex - 1;
      const prevEntry = history[prevIndex];

      setCurrentFolder(prevEntry.folder);
      setCurrentPath(prevEntry.path);
      setCurrentHistoryIndex(prevIndex);
    }
  };

  // 앞으로 가기
  const handleForward = () => {
    if (currentHistoryIndex < history.length - 1) {
      const nextIndex = currentHistoryIndex + 1;
      const nextEntry = history[nextIndex];

      setCurrentFolder(nextEntry.folder);
      setCurrentPath(nextEntry.path);
      setCurrentHistoryIndex(nextIndex);
    }
  };

  // 상위 폴더로 이동
  const handleUpFolder = () => {
    if (currentPath.length > 0) {
      const newPath = [...currentPath];
      newPath.pop(); // 현재 폴더 제거

      let newFolder: QuestionBoxType[];
      if (newPath.length === 0) {
        // 루트로 돌아가기
        newFolder = questionBox;
      } else {
        // 상위 폴더로 돌아가기
        const parentFolder = newPath[newPath.length - 1];
        newFolder = parentFolder.children || [];
      }

      setCurrentPath(newPath);
      setCurrentFolder(newFolder);
      addToHistory(newFolder, newPath); // 히스토리에 추가
    }
  };

  // 현재 경로 표시
  const renderBreadcrumb = () => {
    return (
      <View style={styles.breadcrumb}>
        <Pressable
          onPress={() => {
            const newFolder = questionBox;
            setCurrentPath([]);
            setCurrentFolder(newFolder);
            addToHistory(newFolder, []);
          }}
          style={{flexDirection: 'row'}}>
          <Text style={styles.breadcrumbText}>홈</Text>
          {currentPath.length > 0 && (
            <Text style={styles.breadcrumbSeparator}> / </Text>
          )}
        </Pressable>
        {currentPath.map((folder, index) => (
          <React.Fragment key={folder.id}>
            <Pressable
              onPress={() => {
                const newPath = currentPath.slice(0, index + 1);
                const newFolder = folder.children || [];
                setCurrentPath(newPath);
                setCurrentFolder(newFolder);
                addToHistory(newFolder, newPath);
              }}>
              <Text style={styles.breadcrumbText}>{folder.title}</Text>
            </Pressable>
            {index < currentPath.length - 1 && (
              <Text style={styles.breadcrumbSeparator}> / </Text>
            )}
          </React.Fragment>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="title" weight="bold">
          문제 보관함
        </Text>
      </View>

      <View style={styles.folderHeader}>
        {/* 네비게이션 버튼 */}
        <View style={styles.navigationButtons}>
          <Pressable
            onPress={handleBack}
            style={[
              styles.navButton,
              currentHistoryIndex <= 0 && styles.navButtonDisabled,
            ]}>
            <BackArrowIcon width={iconSize.md} height={iconSize.md} />
          </Pressable>

          <Pressable
            onPress={handleForward}
            style={[
              styles.navButton,
              currentHistoryIndex >= history.length - 1 &&
                styles.navButtonDisabled,
            ]}>
            <BackArrowIcon
              width={iconSize.md}
              height={iconSize.md}
              style={styles.forwardIcon}
            />
          </Pressable>

          <Pressable
            onPress={handleUpFolder}
            style={[
              styles.navButton,
              {marginLeft: spacing.lg},
              currentPath.length === 0 && styles.navButtonDisabled,
            ]}>
            <UpArrowIcon
              width={iconSize.sm}
              height={iconSize.sm}
              style={styles.upIcon}
            />
          </Pressable>
        </View>

        {/* 현재 경로 표시 */}
        {renderBreadcrumb()}
        <View
          style={{
            flexDirection: 'row',
            gap: spacing.lg,
            marginLeft: 'auto',
            marginRight: spacing.xxl,
          }}>
          <SearchIcon width={iconSize.md} height={iconSize.md} />
          <AddFolderIcon width={iconSize.md} height={iconSize.md} />
        </View>
      </View>

      {/* 폴더/파일 목록 */}
      <View style={styles.fileList}>
        {currentFolder.map(item => (
          <Pressable
            key={item.id}
            onPress={() => {
              if (item.type === 'folder') {
                handleFolderPress(item);
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
  folderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    height: spacing.xxl,
    marginVertical: spacing.xl,
    gap: spacing.xl,
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  navButton: {
    padding: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  forwardIcon: {
    transform: [{rotate: '180deg'}],
  },
  upIcon: {
    transform: [{rotate: '90deg'}],
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
    flexWrap: 'wrap',
  },
  breadcrumbText: {
    color: '#007AFF',
  },
  breadcrumbSeparator: {
    marginHorizontal: spacing.xs,
    color: '#666',
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
