import {create} from 'zustand';

export type QuestionBoxType = {
  id: number;
  type: 'folder' | 'file';
  parentId: number | null;
  title: string;
  children: QuestionBoxType[];
  childrenCount: number;
};

export type HistoryEntry = {
  folder: QuestionBoxType[];
  path: QuestionBoxType[];
};

type QuestionExplorerState = {
  rootId: number;
  questionBox: QuestionBoxType[];
  currentPath: QuestionBoxType[];
  currentFolder: QuestionBoxType[];
  history: HistoryEntry[];
  currentHistoryIndex: number;

  // Selectors
  getCurrentParentId: () => number;
  getCurrentFolderId: () => number;

  // Actions
  initializeStore: (rootId: number, initialData: QuestionBoxType[]) => void;
  navigateToFolder: (folder: QuestionBoxType) => void;
  navigateBack: () => void;
  navigateForward: () => void;
  navigateUp: () => void;
  navigateToHome: () => void;
  navigateToBreadcrumb: (index: number, folder: QuestionBoxType) => void;

  // File System Actions
  cleanHistory: (
    history: HistoryEntry[],
    tree: QuestionBoxType[],
    currentIndex: number,
  ) => {cleanedHistory: HistoryEntry[]; newIndex: number};
  isValidPath: (path: QuestionBoxType[], tree: QuestionBoxType[]) => boolean;
  updateHistoryAfterChange: (newQuestionBox: QuestionBoxType[]) => void;
  updateFolderChildren: (folderId: number, children: QuestionBoxType[]) => void;
  createItem: (item: QuestionBoxType) => void;
  deleteItem: (itemId: number) => void;
  isDescendant: (
    sourceId: number,
    targetId: number,
    items: QuestionBoxType[],
  ) => boolean;
  moveItem: (itemId: number, newParentId: number) => void;
  renameItem: (itemId: number, newTitle: string) => void;
  updateHistoryEntries: (
    tree: QuestionBoxType[],
    entry: HistoryEntry,
  ) => HistoryEntry;
};

export const useQuestionExplorerStore = create<QuestionExplorerState>(
  (set, get) => ({
    rootId: 0,
    questionBox: [],
    currentPath: [],
    currentFolder: [],
    history: [],
    currentHistoryIndex: -1,

    getCurrentParentId: () => {
      const {rootId, currentPath} = get();
      if (currentPath.length === 0) {
        return rootId;
      }
      const currentPathLast = currentPath[currentPath.length - 1];
      return currentPathLast.id;
    },

    getCurrentFolderId: () => {
      const {rootId, currentPath} = get();
      if (currentPath.length === 0) {
        return rootId;
      }
      return currentPath[currentPath.length - 1].id;
    },

    // Helper function to update a history entry with the latest tree state
    updateHistoryEntries: (
      tree: QuestionBoxType[],
      entry: HistoryEntry,
    ): HistoryEntry => {
      const updatedPath: QuestionBoxType[] = [];
      let currentItems = tree;

      // Update path items with latest state
      for (const pathItem of entry.path) {
        const found = currentItems.find(item => item.id === pathItem.id);
        if (found && found.type === 'folder') {
          updatedPath.push(found);
          currentItems = found.children;
        } else {
          break;
        }
      }

      // Get the current folder's contents
      let updatedFolder: QuestionBoxType[] = tree;
      if (updatedPath.length > 0) {
        const lastFolder = updatedPath[updatedPath.length - 1];
        updatedFolder = lastFolder.children;
      }

      return {
        path: updatedPath,
        folder: updatedFolder,
      };
    },

    isValidPath: (
      path: QuestionBoxType[],
      tree: QuestionBoxType[],
    ): boolean => {
      let current = tree;

      for (const folder of path) {
        const found = current.find(item => item.id === folder.id);
        if (!found || found.type !== 'folder') {
          return false;
        }
        current = found.children;
      }
      return true;
    },

    cleanHistory: (
      history: HistoryEntry[],
      tree: QuestionBoxType[],
      currentIndex: number,
    ): {cleanedHistory: HistoryEntry[]; newIndex: number} => {
      let newIndex = currentIndex;
      const cleanedHistory = history.filter((entry, index) => {
        const isValid = get().isValidPath(entry.path, tree);
        if (!isValid && index <= currentIndex) {
          newIndex--;
        }
        return isValid;
      });

      // Update remaining history entries with latest tree state
      const updatedHistory = cleanedHistory.map(entry =>
        get().updateHistoryEntries(tree, entry),
      );

      newIndex = Math.max(-1, Math.min(newIndex, updatedHistory.length - 1));
      return {cleanedHistory: updatedHistory, newIndex};
    },

    updateHistoryAfterChange: (newQuestionBox: QuestionBoxType[]) => {
      const state = get();
      const {currentPath} = state;

      const updatedPath = [];
      let currentFolder = newQuestionBox;
      let isPathValid = true;

      for (const pathItem of currentPath) {
        const found = currentFolder.find(item => item.id === pathItem.id);
        if (found && found.type === 'folder') {
          updatedPath.push(found);
          currentFolder = found.children;
        } else {
          isPathValid = false;
          break;
        }
      }

      if (!isPathValid) {
        set({
          questionBox: newQuestionBox,
          currentPath: [],
          currentFolder: newQuestionBox,
          history: [{folder: newQuestionBox, path: []}],
          currentHistoryIndex: 0,
        });
        return;
      }

      const {cleanedHistory, newIndex} = get().cleanHistory(
        state.history,
        newQuestionBox,
        state.currentHistoryIndex,
      );

      set({
        questionBox: newQuestionBox,
        currentPath: updatedPath,
        currentFolder,
        history: cleanedHistory,
        currentHistoryIndex: newIndex,
      });
    },

    updateFolderChildren: (folderId: number, children: QuestionBoxType[]) => {
      const state = get();

      const updateTree = (items: QuestionBoxType[]): QuestionBoxType[] => {
        return items.map(item => {
          if (item.id === folderId) {
            return {
              ...item,
              children,
            };
          }
          if (item.children.length > 0) {
            return {
              ...item,
              children: updateTree(item.children),
            };
          }
          return item;
        });
      };

      const newQuestionBox = updateTree(state.questionBox);
      state.updateHistoryAfterChange(newQuestionBox);
    },

    initializeStore: (rootId, initialData) => {
      set({
        rootId,
        questionBox: initialData,
        currentFolder: initialData,
        currentPath: [],
        history: [{folder: initialData, path: []}],
        currentHistoryIndex: 0,
      });
    },

    navigateToFolder: (folder: QuestionBoxType) => {
      if (folder.children) {
        const newPath = [...get().currentPath, folder];
        const newFolder = folder.children;
        const newHistoryEntry = {folder: newFolder, path: newPath};

        set(state => ({
          currentPath: newPath,
          currentFolder: newFolder,
          history: [
            ...state.history.slice(0, state.currentHistoryIndex + 1),
            newHistoryEntry,
          ],
          currentHistoryIndex: state.currentHistoryIndex + 1,
        }));
      }
    },

    navigateBack: () => {
      const {currentHistoryIndex, history} = get();
      if (currentHistoryIndex > 0) {
        const prevIndex = currentHistoryIndex - 1;
        const prevEntry = history[prevIndex];

        set({
          currentFolder: prevEntry.folder,
          currentPath: prevEntry.path,
          currentHistoryIndex: prevIndex,
        });
      }
    },

    navigateForward: () => {
      const {currentHistoryIndex, history} = get();
      if (currentHistoryIndex < history.length - 1) {
        const nextIndex = currentHistoryIndex + 1;
        const nextEntry = history[nextIndex];

        set({
          currentFolder: nextEntry.folder,
          currentPath: nextEntry.path,
          currentHistoryIndex: nextIndex,
        });
      }
    },

    navigateUp: () => {
      const {currentPath, questionBox} = get();
      if (currentPath.length > 0) {
        const newPath = [...currentPath];
        newPath.pop();

        let newFolder: QuestionBoxType[];
        if (newPath.length === 0) {
          newFolder = questionBox;
        } else {
          const parentFolder = newPath[newPath.length - 1];
          newFolder = parentFolder.children || [];
        }

        const newHistoryEntry = {folder: newFolder, path: newPath};

        set(state => ({
          currentPath: newPath,
          currentFolder: newFolder,
          history: [
            ...state.history.slice(0, state.currentHistoryIndex + 1),
            newHistoryEntry,
          ],
          currentHistoryIndex: state.currentHistoryIndex + 1,
        }));
      }
    },

    navigateToHome: () => {
      const {questionBox} = get();
      const newHistoryEntry = {folder: questionBox, path: []};

      set(state => ({
        currentPath: [],
        currentFolder: questionBox,
        history: [
          ...state.history.slice(0, state.currentHistoryIndex + 1),
          newHistoryEntry,
        ],
        currentHistoryIndex: state.currentHistoryIndex + 1,
      }));
    },

    navigateToBreadcrumb: (index: number, folder: QuestionBoxType) => {
      const {currentPath} = get();
      const newPath = currentPath.slice(0, index + 1);
      const newFolder = folder.children || [];
      const newHistoryEntry = {folder: newFolder, path: newPath};

      set(state => ({
        currentPath: newPath,
        currentFolder: newFolder,
        history: [
          ...state.history.slice(0, state.currentHistoryIndex + 1),
          newHistoryEntry,
        ],
        currentHistoryIndex: state.currentHistoryIndex + 1,
      }));
    },

    createItem: (newItem: QuestionBoxType) => {
      const state = get();
      if (newItem.type === 'file') {
        newItem.children = [];
        newItem.childrenCount = 0;
      }

      const updateTree = (items: QuestionBoxType[]): QuestionBoxType[] => {
        if (newItem.parentId === null || newItem.parentId === state.rootId) {
          return [...items, newItem];
        }

        return items.map(item => {
          if (item.id === newItem.parentId) {
            return {
              ...item,
              children: [...item.children, newItem],
            };
          }
          if (item.children.length > 0) {
            return {
              ...item,
              children: updateTree(item.children),
            };
          }
          return item;
        });
      };

      const newQuestionBox = updateTree(state.questionBox);

      // 현재 폴더에 새 아이템 추가
      let newCurrentFolder = state.currentFolder;
      const currentParentId = state.getCurrentParentId();

      if (currentParentId === newItem.parentId) {
        newCurrentFolder = [...newCurrentFolder, newItem];
      }

      set(state => ({
        questionBox: newQuestionBox,
        currentFolder: newCurrentFolder,
        history: state.history.map((entry, index) =>
          index === state.currentHistoryIndex
            ? {
                ...entry,
                folder: newCurrentFolder,
              }
            : entry,
        ),
      }));
    },

    deleteItem: (itemId: number) => {
      const state = get();

      // Check if we're currently inside the folder being deleted
      const isInDeletedPath = state.currentPath.some(
        item => item.id === itemId,
      );

      const deleteFromTree = (items: QuestionBoxType[]): QuestionBoxType[] => {
        return items.filter(item => {
          if (item.id === itemId) return false;
          if (item.children.length > 0) {
            item.children = deleteFromTree(item.children);
          }
          return true;
        });
      };

      const newQuestionBox = deleteFromTree(state.questionBox);

      // If we're in the deleted folder, navigate to parent
      if (isInDeletedPath) {
        const newPath = state.currentPath.slice(0, -1);
        let newFolder = newQuestionBox;

        if (newPath.length > 0) {
          let current = newQuestionBox;
          for (const folder of newPath) {
            const found = current.find(item => item.id === folder.id);
            if (found?.children) {
              current = found.children;
            }
          }
          newFolder = current;
        }

        set({
          questionBox: newQuestionBox,
          currentPath: newPath,
          currentFolder: newFolder,
          history: [{folder: newFolder, path: newPath}],
          currentHistoryIndex: 0,
        });
      } else {
        state.updateHistoryAfterChange(newQuestionBox);
      }
    },

    isDescendant: (
      sourceId: number,
      targetId: number,
      items: QuestionBoxType[],
    ): boolean => {
      const findInTree = (
        currentId: number,
        items: QuestionBoxType[],
      ): boolean => {
        for (const item of items) {
          if (item.id === currentId) {
            return true;
          }
          if (
            item.children.length > 0 &&
            findInTree(currentId, item.children)
          ) {
            return true;
          }
        }
        return false;
      };

      const findSource = (items: QuestionBoxType[]): QuestionBoxType | null => {
        for (const item of items) {
          if (item.id === sourceId) {
            return item;
          }
          if (item.children.length > 0) {
            const found = findSource(item.children);
            if (found) return found;
          }
        }
        return null;
      };

      const sourceItem = findSource(items);
      if (!sourceItem) return false;

      return findInTree(targetId, sourceItem.children);
    },

    moveItem: (itemId: number, newParentId: number) => {
      const state = get();

      // 자신의 하위 폴더로 이동하려는 경우 체크
      if (
        state.isDescendant(itemId, newParentId, state.questionBox) ||
        itemId === newParentId
      ) {
        console.warn('Cannot move a folder into its own subfolder');
        return;
      }

      let itemToMove: QuestionBoxType | null = null;
      let oldParentId: number | null = null;

      // 트리에서 아이템을 찾고 제거하는 함수
      const removeFromTree = (items: QuestionBoxType[]): QuestionBoxType[] => {
        const result: QuestionBoxType[] = [];

        for (const item of items) {
          if (item.id === itemId) {
            itemToMove = {...item, parentId: newParentId};
            continue;
          }

          const newItem = {...item};
          if (item.children.length > 0) {
            const newChildren = removeFromTree(item.children);
            if (newChildren.length !== item.children.length) {
              oldParentId = item.id;
            }
            newItem.children = newChildren;
          }
          result.push(newItem);
        }

        return result;
      };

      // 루트 레벨 아이템 처리
      let newQuestionBox = [...state.questionBox];
      const rootIndex = newQuestionBox.findIndex(item => item.id === itemId);

      if (rootIndex !== -1) {
        itemToMove = {...newQuestionBox[rootIndex], parentId: newParentId};
        oldParentId = null;
        newQuestionBox.splice(rootIndex, 1);
      } else {
        newQuestionBox = removeFromTree(newQuestionBox);
      }

      if (!itemToMove) {
        console.warn('Item not found');
        return;
      }

      // 새로운 위치에 아이템 추가
      const addToTree = (items: QuestionBoxType[]): QuestionBoxType[] => {
        return items.map(item => {
          if (item.id === newParentId) {
            return {
              ...item,
              children: [...item.children, itemToMove!],
              childrenCount:
                item.type === 'folder' ? item.children.length + 1 : 0,
            };
          }
          if (item.children.length > 0) {
            return {
              ...item,
              children: addToTree(item.children),
            };
          }
          return item;
        });
      };

      // 루트로 이동하는 경우
      if (newParentId === state.rootId) {
        newQuestionBox = [...newQuestionBox, itemToMove];
      } else {
        // 새로운 부모 폴더가 존재하는지 확인
        let parentFound = false;
        const findParent = (items: QuestionBoxType[]) => {
          for (const item of items) {
            if (item.id === newParentId) {
              parentFound = true;
              break;
            }
            if (item.children.length > 0) {
              findParent(item.children);
            }
          }
        };
        findParent(newQuestionBox);

        if (!parentFound) {
          console.warn('Target parent folder not found');
          return;
        }

        newQuestionBox = addToTree(newQuestionBox);
      }

      // 현재 경로상의 모든 폴더의 childrenCount 업데이트
      const updateChildrenCounts = (
        items: QuestionBoxType[],
      ): QuestionBoxType[] => {
        return items.map(item => {
          if (item.type === 'folder') {
            return {
              ...item,
              children: updateChildrenCounts(item.children),
              childrenCount: item.children.length,
            };
          }
          return item;
        });
      };

      newQuestionBox = updateChildrenCounts(newQuestionBox);

      // 현재 폴더의 내용 업데이트
      let newCurrentFolder = state.currentFolder;
      const currentParentId = state.getCurrentParentId();

      // 현재 폴더에서 아이템이 제거된 경우
      if (
        currentParentId === oldParentId ||
        (oldParentId === null && currentParentId === state.rootId)
      ) {
        newCurrentFolder = newCurrentFolder.filter(item => item.id !== itemId);
      }

      // 현재 폴더로 아이템이 이동된 경우
      if (currentParentId === newParentId) {
        newCurrentFolder = [...newCurrentFolder, itemToMove];
      }

      // 상태 업데이트 및 히스토리 정리
      set(state => {
        const updatedState = {
          questionBox: newQuestionBox,
          currentFolder: newCurrentFolder,
        };

        // 히스토리의 각 엔트리를 새로운 트리 상태로 업데이트
        const updatedHistory = state.history.map((entry, index) => {
          if (index === state.currentHistoryIndex) {
            return {
              ...entry,
              folder: newCurrentFolder,
            };
          }
          return get().updateHistoryEntries(newQuestionBox, entry);
        });

        return {
          ...updatedState,
          history: updatedHistory,
        };
      });

      // 전체 상태 동기화를 위해 updateHistoryAfterChange 호출
      state.updateHistoryAfterChange(newQuestionBox);
    },

    renameItem: (itemId: number, newTitle: string) => {
      const state = get();

      const updateTree = (items: QuestionBoxType[]): QuestionBoxType[] => {
        return items.map(item => {
          if (item.id === itemId) {
            return {...item, title: newTitle};
          }
          if (item.children.length > 0) {
            return {
              ...item,
              children: updateTree(item.children),
            };
          }
          return item;
        });
      };

      const newQuestionBox = updateTree(state.questionBox);
      state.updateHistoryAfterChange(newQuestionBox);
    },
  }),
);
