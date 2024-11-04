import React from 'react';
import {create} from 'zustand';

interface ModalState {
  isModalOpened: boolean;
  modalContent: React.ReactNode;
  modalTitle: string;
  modalSize: 'sm' | 'md' | 'lg';

  setIsModalOpened: (value: boolean) => void;
  setModalContent: (content: React.ReactNode) => void;
  setModalTitle: (title: string) => void;
  setModalSize: (size: 'sm' | 'md' | 'lg') => void;
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
