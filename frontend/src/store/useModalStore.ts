import React from 'react';
import {create} from 'zustand';

interface ModalState {
  isModalOpened: boolean;
  modalContent: React.ReactNode;
  modalTitle: string;
  modalSize: 'xs' | 'sm' | 'md' | 'lg' | 'full';

  setIsModalOpened: (value: boolean) => void;
  setModalContent: (content: React.ReactNode) => void;
  setModalTitle: (title: string) => void;
  setModalSize: (size: 'xs' | 'sm' | 'md' | 'lg' | 'full') => void;
}

export const useModalStore = create<ModalState>(set => ({
  isModalOpened: false,
  modalContent: null,
  modalTitle: '',
  modalSize: 'md',
  setIsModalOpened: value => {
    if (!value) {
      set({
        modalContent: null,
        modalTitle: '',
        modalSize: 'md',
      });
    }
    set({
      isModalOpened: value,
    });
  },
  setModalContent: content => set({modalContent: content}),
  setModalTitle: title => set({modalTitle: title}),
  setModalSize: size => set({modalSize: size}),
}));
