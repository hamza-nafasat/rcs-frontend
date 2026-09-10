import { createSlice } from "@reduxjs/toolkit";

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

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: { items: initialNotifications },
  reducers: {
    markRead: (state, action) => {
      const item = state.items.find((entry) => entry.id === action.payload);
      if (item) item.isRead = true;
    },
    markAllRead: (state) => {
      state.items.forEach((entry) => {
        entry.isRead = true;
      });
    },
    removeNotification: (state, action) => {
      state.items = state.items.filter((entry) => entry.id !== action.payload);
    },
    addNotification: (state, action) => {
      const notification = action.payload;
      state.items.unshift({
        id: notification.id ?? Date.now(),
        type: notification.type ?? "system",
        time: notification.time ?? "Just now",
        isRead: false,
        ...notification,
      });
    },
  },
});

export const { markRead, markAllRead, removeNotification, addNotification } =
  notificationsSlice.actions;

export const selectNotifications = (state) => state.notifications.items;
export const selectUnreadCount = (state) =>
  state.notifications.items.filter((entry) => !entry.isRead).length;

export default notificationsSlice.reducer;
