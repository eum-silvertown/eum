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

    // Helper function to check if a path is still valid after changes
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

    // Helper function to clean history entries that contain deleted items
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

      // Ensure newIndex is not out of bounds
      newIndex = Math.max(-1, Math.min(newIndex, cleanedHistory.length - 1));
      return {cleanedHistory, newIndex};
    },

    updateHistoryAfterChange: (newQuestionBox: QuestionBoxType[]) => {
      const state = get();
      const {currentPath} = state;

      // Update current path with new data to maintain references
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

      // If current path is invalid, navigate to home
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

      // Clean history to remove entries with invalid paths
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

      // Check if trying to move to its own descendant or itself
      if (
        state.isDescendant(itemId, newParentId, state.questionBox) ||
        itemId === newParentId
      ) {
        console.warn('Cannot move a folder into its own subfolder');
        return; // Early return without any state changes
      }

      let itemToMove: QuestionBoxType | null = null;
      let oldParentId: number | null = null;
      let found = false; // Flag to track if item was found and removed

      const removeFromTree = (items: QuestionBoxType[]): QuestionBoxType[] => {
        return items.map(item => {
          if (item.children.length > 0) {
            const filteredChildren = item.children.filter(child => {
              if (child.id === itemId) {
                itemToMove = {...child, parentId: newParentId};
                oldParentId = item.id;
                found = true; // Set flag when item is found and removed
                return false;
              }
              return true;
            });

            return {
              ...item,
              children:
                filteredChildren.length === item.children.length && !found
                  ? removeFromTree(item.children)
                  : filteredChildren,
            };
          }
          return item;
        });
      };

      // Handle root level items
      let newQuestionBox = [...state.questionBox];
      const rootIndex = newQuestionBox.findIndex(item => item.id === itemId);
      if (rootIndex !== -1) {
        itemToMove = {...newQuestionBox[rootIndex], parentId: newParentId};
        oldParentId = null;
        newQuestionBox.splice(rootIndex, 1);
        found = true;
      } else {
        newQuestionBox = removeFromTree(newQuestionBox);
      }

      // If item wasn't found or removed, return without changes
      if (!itemToMove || !found) {
        console.warn('Item not found');
        return;
      }

      const addToTree = (items: QuestionBoxType[]): QuestionBoxType[] => {
        return items.map(item => {
          if (item.id === newParentId) {
            return {
              ...item,
              children: [...item.children, itemToMove!],
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

      // If new parent is root
      if (newParentId === state.rootId) {
        newQuestionBox = [...newQuestionBox, itemToMove];
      } else {
        // Verify that new parent exists before adding
        let parentFound = false;
        const findParent = (items: QuestionBoxType[]) => {
          for (const item of items) {
            if (item.id === newParentId) {
              parentFound = true;
              return;
            }
            if (item.children.length > 0) {
              findParent(item.children);
            }
          }
        };
        findParent(newQuestionBox);

        if (!parentFound) {
          console.warn('Target parent folder not found');
          return; // Early return if parent doesn't exist
        }

        newQuestionBox = addToTree(newQuestionBox);
      }

      // Update the current folder if needed
      let newCurrentFolder = state.currentFolder;
      const currentParentId = state.getCurrentParentId();

      // If the item was moved from current folder
      if (currentParentId === oldParentId || currentParentId === null) {
        newCurrentFolder = newCurrentFolder.filter(
          item => item.id !== itemToMove!.id,
        );
      }

      // If the item was moved to current folder
      if (currentParentId === newParentId) {
        newCurrentFolder = [...newCurrentFolder, itemToMove];
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
