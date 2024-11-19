import React, {useContext} from 'react';

// Modal Context to provide close function
interface ModalContextType {
  close: () => void;
}

export const ModalContext = React.createContext<ModalContextType | null>(null);

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
};
