import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getEnv } from "../../../configs/env";

export const messageApi = createApi({
  reducerPath: "messageApi",

  baseQuery: fetchBaseQuery({ baseUrl: `${getEnv("VITE_SERVER_URL")}/api/messages`, credentials: "include" }),
  tagTypes: ["Conversations", "Messages"],
  endpoints: (builder) => ({
    /////
    getContacts: builder.query({
      query: () => "/contacts",
    }),
    /////
    getMyConversations: builder.query({
      query: () => "/conversations",
      providesTags: ["Conversations"],
    }),
    /////
    startConversation: builder.mutation({
      query: (participant) => ({ url: "/conversations", method: "POST", body: { participant } }),
      invalidatesTags: ["Conversations"],
    }),
    /////
    getMessages: builder.query({
      query: (conversationId) => `/conversations/${encodeURIComponent(conversationId)}/messages`,
      providesTags: (_result, _error, conversationId) => [{ type: "Messages", id: conversationId }],
    }),
    /////
    sendMessage: builder.mutation({
      query: ({ conversationId, body }) => ({
        url: `/conversations/${encodeURIComponent(conversationId)}/messages`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { conversationId }) => [
        { type: "Messages", id: conversationId },
        "Conversations",
      ],
    }),
    /////
    markConversationRead: builder.mutation({
      query: (conversationId) => ({
        url: `/conversations/${encodeURIComponent(conversationId)}/read`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, conversationId) => [{ type: "Messages", id: conversationId }, "Conversations"],
    }),
    /////
    deleteConversation: builder.mutation({
      query: (conversationId) => ({ url: `/conversations/${encodeURIComponent(conversationId)}`, method: "DELETE" }),
      invalidatesTags: ["Conversations"],
    }),
    /////
    deleteMessage: builder.mutation({
      query: ({ conversationId, messageId }) => ({
        url: `/conversations/${encodeURIComponent(conversationId)}/messages/${encodeURIComponent(messageId)}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { conversationId }) => [
        { type: "Messages", id: conversationId },
        "Conversations",
      ],
    }),
  }),
});

export const {
  useGetContactsQuery,
  useGetMyConversationsQuery,
  useStartConversationMutation,
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkConversationReadMutation,
  useDeleteConversationMutation,
  useDeleteMessageMutation,
} = messageApi;
