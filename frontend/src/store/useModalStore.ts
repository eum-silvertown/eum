import React from 'react';
import {create} from 'zustand';

interface ModalData {
  id: string;
  isOpened: boolean;
  content: React.ReactNode;
  title: string;
  size: 'xs' | 'sm' | 'md' | 'lg' | 'full';
  onClose?: () => void;
}

interface ModalStackState {
  modals: ModalData[];
  openModal: (modal: Omit<ModalData, 'isOpened' | 'id'>) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  updateModal: (id: string, updates: Partial<Omit<ModalData, 'id'>>) => void;
}

export const useModalStore = create<ModalStackState>(set => ({
  modals: [],

  openModal: modal => {
    const id = Math.random().toString(36).substr(2, 9);
    set(state => ({
      modals: [...state.modals, {...modal, id, isOpened: true}],
    }));
    return id;
  },

  closeModal: id =>
    set(state => {
      const modalToClose = state.modals.find(modal => modal.id === id);
      if (modalToClose?.onClose) {
        modalToClose.onClose();
      }
      return {
        modals: state.modals.filter(modal => modal.id !== id),
      };
    }),

  closeAllModals: () =>
    set(state => {
      state.modals.forEach(modal => modal.onClose?.());
      return {modals: []};
    }),

  updateModal: (id, updates) =>
    set(state => ({
      modals: state.modals.map(modal =>
        modal.id === id ? {...modal, ...updates} : modal,
      ),
    })),
}));

export const useModal = () => {
  const store = useModalStore();

  const open = React.useCallback(
    (
      content: React.ReactNode,
      options?: {
        title?: string;
        size?: ModalData['size'];
        onClose?: () => void;
      },
    ) => {
      const modalId = store.openModal({
        content,
        title: options?.title || '',
        size: options?.size || 'md',
        onClose: options?.onClose,
      });

      return () => store.closeModal(modalId);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return {
    modals: store.modals,
    open,
    closeAll: store.closeAllModals,
  };
};
