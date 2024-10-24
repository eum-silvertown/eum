import {create} from 'zustand';

interface SidebarState {
  isExpanded: boolean;
  toggleSidebar: () => void;
}

const useSidebarStore = create<SidebarState>(set => ({
  isExpanded: false,
  toggleSidebar: () => set(state => ({isExpanded: !state.isExpanded})),
}));

export default useSidebarStore;
