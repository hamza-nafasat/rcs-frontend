import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getEnv } from "../../../configs/env";

export const notificationApi = createApi({
  reducerPath: "notificationApi",

  baseQuery: fetchBaseQuery({ baseUrl: `${getEnv("VITE_SERVER_URL")}/api/notifications`, credentials: "include" }),
  tagTypes: ["Notifications"],
  endpoints: (builder) => ({
    /////
    getMyNotifications: builder.query({
      query: (params = {}) => ({ url: "", params }),
      providesTags: ["Notifications"],
    }),
    /////
    markNotificationRead: builder.mutation({
      query: (id) => ({ url: `/${encodeURIComponent(id)}/read`, method: "PATCH" }),
      invalidatesTags: ["Notifications"],
    }),
    /////
    markAllNotificationsRead: builder.mutation({
      query: () => ({ url: "/read-all", method: "PATCH" }),
      invalidatesTags: ["Notifications"],
    }),
    /////
    deleteNotification: builder.mutation({
      query: (id) => ({ url: `/${encodeURIComponent(id)}`, method: "DELETE" }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

// the pushed notification goes straight in
export const receiveNotification = (notification) =>
  notificationApi.util.updateQueryData("getMyNotifications", undefined, (draft) => {
    const existing = draft?.data?.notifications;
    if (!notification?._id || !existing || existing.some((item) => item._id === notification._id)) return;

    existing.unshift(notification);
    draft.data.unreadCount += 1;
  });

export const {
  useGetMyNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,
} = notificationApi;
