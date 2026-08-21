import { useCallback, useMemo, useState } from "react";
import { NotificationsContext } from "./notificationsContextValue";

const initialNotifications = [
  {
    id: 1,
    type: "document",
    title: "New FDD version uploaded",
    description: "Burger Hub FDD 2025 (v3.1) is ready for your review.",
    time: "10 minutes ago",
    isRead: false,
  },
  {
    id: 2,
    type: "support",
    title: "Ticket TKT-1002 escalated",
    description: "Franchisee login not working has been marked urgent.",
    time: "1 hour ago",
    isRead: false,
  },
  {
    id: 3,
    type: "message",
    title: "New message from Pizza Corner",
    description: "You have 3 unread messages in the chat module.",
    time: "Yesterday",
    isRead: true,
  },
  {
    id: 4,
    type: "system",
    title: "Company profile updated",
    description: "Your company contact details were changed successfully.",
    time: "2 days ago",
    isRead: true,
  },
];

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item)),
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addNotification = useCallback((notification) => {
    setNotifications((prev) => [
      {
        id: notification.id ?? Date.now(),
        type: notification.type ?? "system",
        time: notification.time ?? "Just now",
        isRead: false,
        ...notification,
      },
      ...prev,
    ]);
  }, []);

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      markRead,
      markAllRead,
      removeNotification,
      addNotification,
    }),
    [
      notifications,
      unreadCount,
      markRead,
      markAllRead,
      removeNotification,
      addNotification,
    ],
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};
