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

export const {
  useGetMyNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,
} = notificationApi;
