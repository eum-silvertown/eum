import {ModalData, useModalStore} from '@store/useModalStore';
import {useCallback} from 'react';

export const useModal = () => {
  const store = useModalStore();

  const open = useCallback(
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
