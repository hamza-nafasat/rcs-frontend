import { createSlice } from "@reduxjs/toolkit";

const MINUTE = 60 * 1000;

const minutesAgo = (minutes) => new Date(Date.now() - minutes * MINUTE).toISOString();

// TODO: replace with the notifications API
const initialNotifications = [
  { id: 1, kind: "message_received", meta: { name: "Downtown Grill" }, createdAt: minutesAgo(8), isRead: false },
  { id: 2, kind: "ticket_raised", meta: { name: "Coastal Bites", ticketId: "#TKT-1002", subject: "Login not working" }, createdAt: minutesAgo(55), isRead: false },
  { id: 3, kind: "client_onboarded", meta: { name: "Prairie Table" }, createdAt: minutesAgo(180), isRead: false },
  { id: 4, kind: "fdd_filled", meta: { fddName: "FDD 2026 v3.1", name: "The Harbor Kitchen" }, createdAt: minutesAgo(1500), isRead: true },
  { id: 5, kind: "account_created", meta: { name: "Downtown Grill" }, createdAt: minutesAgo(2), isRead: false },
  { id: 6, kind: "ticket_status_changed", meta: { ticketId: "#TKT-1003", status: "resolved", name: "RCS Support" }, createdAt: minutesAgo(90), isRead: false },
  { id: 7, kind: "fdd_received", meta: { fddName: "FDD 2026 v3.1", name: "RCS Support" }, createdAt: minutesAgo(600), isRead: true },
  { id: 8, kind: "fdd_approved", meta: { fddName: "FDD 2026 v3.0", name: "RCS Support" }, createdAt: minutesAgo(2880), isRead: true },
  { id: 9, kind: "profile_updated", meta: { name: "You" }, createdAt: minutesAgo(4320), isRead: true },
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
      const { id, kind, meta, createdAt } = action.payload ?? {};
      state.items.unshift({
        id: id ?? Date.now(),
        kind: kind ?? "profile_updated",
        meta: meta ?? {},
        createdAt: createdAt ?? new Date().toISOString(),
        isRead: false,
      });
    },
  },
});

export const { markRead, markAllRead, removeNotification, addNotification } = notificationsSlice.actions;

export const selectNotifications = (state) => state.notifications.items;

export default notificationsSlice.reducer;
