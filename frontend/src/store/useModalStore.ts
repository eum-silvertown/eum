import React from 'react';
import {create} from 'zustand';

interface ModalState {
  isModalOpened: boolean;
  setIsModalOpened: (value: boolean) => void;
  modalContent: React.ReactNode;
  setModalContent: (content: React.ReactNode) => void;
}

export const useModalStore = create<ModalState>(set => ({
  isModalOpened: false,
  modalContent: null,
  setIsModalOpened: value => set({isModalOpened: value}),
  setModalContent: content => set({modalContent: content}),
}));
