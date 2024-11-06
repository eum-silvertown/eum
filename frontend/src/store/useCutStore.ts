import {create} from 'zustand';

type CutState = {
  title: string;
  folderId: number;

  setFolder: (title: string, folderId: number) => void;
};

export const useCutStore = create<CutState>(set => ({
  title: '',
  folderId: 0,

  setFolder: (title: string, folderId: number) => {
    set({
      title: title,
      folderId: folderId,
    });
  },
}));
