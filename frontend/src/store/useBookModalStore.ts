import {create} from 'zustand';

type BookPosition = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type ContainerPosition = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type BookInfo = {
  title: string;
  subtitle: string;
  backgroundColor: string;
  fontColor: string;
  grade: string;
  classNumber: string;
  teacherName: string;
};

type BookModalState = {
  isBookOpened: boolean;
  bookPosition: BookPosition | null;
  bookInfo: BookInfo | null;
  containerPosition: ContainerPosition | null;

  setIsBookOpened: (isBookOpened: boolean) => void;
  setBookPosition: (bookPosition: BookPosition) => void;
  setBookInfo: (bookInfo: BookInfo) => void;
  setContainerPosition: (position: ContainerPosition) => void;
  clearBookPosition: () => void;
  clearBookInfo: () => void;

  closeBook: () => void;
};

export const useBookModalStore = create<BookModalState>((set, get) => ({
  isBookOpened: false,
  bookPosition: null,
  bookInfo: null,
  containerPosition: null,

  setIsBookOpened: (isBookOpened: boolean) => {
    set({
      isBookOpened: isBookOpened,
    });
  },

  setBookPosition: (bookPosition: BookPosition) => {
    set({
      bookPosition: bookPosition,
    });
  },

  setBookInfo: (bookInfo: BookInfo) => {
    set({
      bookInfo: bookInfo,
    });
  },

  setContainerPosition: (position: ContainerPosition) =>
    set({
      containerPosition: position,
    }),

  clearBookPosition: () => {
    set({
      bookPosition: null,
    });
  },

  clearBookInfo: () => {
    set({
      bookInfo: null,
    });
  },

  closeBook: () => {
    const state = get();
    state.setIsBookOpened(false);
  },
}));
