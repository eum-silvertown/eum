import {NotificationType} from '@services/notificationService';
import {create} from 'zustand';

interface NotificationState {
  notifications: NotificationType[];
  unreadNotifications: NotificationType[];
  setUnreadNotifications: (notifications: NotificationType[]) => void;
  setReadNotifications: (notifications: NotificationType[]) => void;
  updateNotifications: (notificationId: number) => void;
  updateDeleteNotification: (notificationId: number) => void;
  readAllNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadNotifications: [],
  setUnreadNotifications: notifications =>
    set({
      unreadNotifications: notifications,
    }),
  setReadNotifications: notifications =>
    set({
      notifications: notifications,
    }),
  updateNotifications: notificationId => {
    const state = get();
    set({
      notifications: [
        ...state.notifications,
        state.unreadNotifications.filter(
          notification => notification.id === notificationId,
        )[0],
      ],
      unreadNotifications: state.unreadNotifications.filter(
        notification => notification.id !== notificationId,
      ),
    });
  },
  updateDeleteNotification: notificationId => {
    const state = get();
    set({
      notifications: state.notifications.filter(
        notification => notification.id !== notificationId,
      ),
      unreadNotifications: state.unreadNotifications.filter(
        unreadNotification => unreadNotification.id !== notificationId,
      ),
    });
  },
  readAllNotifications: () => {
    const state = get();
    const notifications = state.notifications;
    state.unreadNotifications.forEach(unreadNotification =>
      notifications.push(unreadNotification),
    );
    set({
      notifications: notifications,
      unreadNotifications: [],
    });
  },
}));
