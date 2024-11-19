import {create} from 'zustand';
import {LayoutAnimation} from 'react-native';

interface SidebarState {
  isExpanded: boolean;
  toggleSidebar: () => void;
}

const useSidebarStore = create<SidebarState>(set => ({
  isExpanded: false,
  toggleSidebar: () => {
    // easeInEaseOut 프리셋 사용
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
      delete: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    });

    set(state => ({isExpanded: !state.isExpanded}));
  },
}));

export default useSidebarStore;
