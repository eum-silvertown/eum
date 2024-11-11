import {create} from 'zustand';

type CutState = {
  title: string;
  folderId: number;
  type: 'folder' | 'file';

  setFolder: (title: string, folderId: number, type: 'folder' | 'file') => void;
};

export const useCutStore = create<CutState>(set => ({
  title: '',
  folderId: 0,
  type: 'folder',

  setFolder: (title: string, folderId: number, type: 'folder' | 'file') => {
    set({
      title: title,
      folderId: folderId,
      type: type,
    });
  },
}));
