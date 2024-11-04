import {create} from 'zustand';

export type QuestionBoxType = {
  id: number;
  type: 'folder' | 'file';
  parentId: number | null;
  title: string;
  children?: QuestionBoxType[];
};

export type HistoryEntry = {
  folder: QuestionBoxType[];
  path: QuestionBoxType[];
};

type QuestionExplorerState = {
  questionBox: QuestionBoxType[];
  currentPath: QuestionBoxType[];
  currentFolder: QuestionBoxType[];
  history: HistoryEntry[];
  currentHistoryIndex: number;

  // Selectors
  getCurrentParentId: () => number;

  // Actions
  initializeStore: () => void;
  navigateToFolder: (folder: QuestionBoxType) => void;
  navigateBack: () => void;
  navigateForward: () => void;
  navigateUp: () => void;
  navigateToHome: () => void;
  navigateToBreadcrumb: (index: number, folder: QuestionBoxType) => void;
};

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

export const useQuestionExplorerStore = create<QuestionExplorerState>(
  (set, get) => ({
    questionBox: [],
    currentPath: [],
    currentFolder: [],
    history: [],
    currentHistoryIndex: -1,

    getCurrentParentId: () => {
      const {currentPath} = get();
      if (currentPath.length === 0) {
        return 0; // Root level
      }

      const currentPathLast = currentPath[currentPath.length - 1];
      // If current folder has children, use its own ID as parent
      if (currentPathLast.children && currentPathLast.children.length > 0) {
        return currentPathLast.id;
      }
      // If no children, use the ID of its parent
      return currentPathLast.parentId || 0;
    },

    initializeStore: () => {
      set({
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
        const newHistory = [
          ...get().history.slice(0, get().currentHistoryIndex + 1),
          newHistoryEntry,
        ];

        set({
          currentPath: newPath,
          currentFolder: newFolder,
          history: newHistory,
          currentHistoryIndex: newHistory.length - 1,
        });
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
        const newHistory = [
          ...get().history.slice(0, get().currentHistoryIndex + 1),
          newHistoryEntry,
        ];

        set({
          currentPath: newPath,
          currentFolder: newFolder,
          history: newHistory,
          currentHistoryIndex: newHistory.length - 1,
        });
      }
    },

    navigateToHome: () => {
      const {questionBox} = get();
      const newHistoryEntry = {folder: questionBox, path: []};
      const newHistory = [
        ...get().history.slice(0, get().currentHistoryIndex + 1),
        newHistoryEntry,
      ];

      set({
        currentPath: [],
        currentFolder: questionBox,
        history: newHistory,
        currentHistoryIndex: newHistory.length - 1,
      });
    },

    navigateToBreadcrumb: (index: number, folder: QuestionBoxType) => {
      const {currentPath} = get();
      const newPath = currentPath.slice(0, index + 1);
      const newFolder = folder.children || [];
      const newHistoryEntry = {folder: newFolder, path: newPath};
      const newHistory = [
        ...get().history.slice(0, get().currentHistoryIndex + 1),
        newHistoryEntry,
      ];

      set({
        currentPath: newPath,
        currentFolder: newFolder,
        history: newHistory,
        currentHistoryIndex: newHistory.length - 1,
      });
    },
  }),
);
