import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getEnv } from "../../../configs/env";

export const authApi = createApi({
  reducerPath: "authApi",

  baseQuery: fetchBaseQuery({ baseUrl: `${getEnv("VITE_SERVER_URL")}/api/auth`, credentials: "include" }),
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    /////
    login: builder.mutation({
      query: (credentials) => ({ url: "/login", method: "POST", body: credentials }),
      invalidatesTags: (result) => (result ? ["Profile"] : []),
    }),
    /////
    forgetPassword: builder.mutation({
      query: (body) => ({ url: "/forget-password", method: "POST", body }),
    }),
    /////
    resetPassword: builder.mutation({
      query: (body) => ({ url: "/reset-password", method: "POST", body }),
    }),
    /////
    verifyInvite: builder.query({
      query: (inviteToken) => `/invites/verify/${encodeURIComponent(inviteToken)}`,
    }),
    /////
    acceptInvite: builder.mutation({
      query: ({ inviteToken, ...body }) => ({
        url: `/invites/accept/${encodeURIComponent(inviteToken)}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result) => (result ? ["Profile"] : []),
    }),

    /////
    logout: builder.mutation({
      query: () => ({ url: "/logout", method: "GET" }),
      //   await queryFulfilled.catch(() => {});
      invalidatesTags: (result) => (result ? ["Profile"] : []),
    }),
    /////
    getMyProfile: builder.query({
      query: () => "/me",
      providesTags: ["Profile"],
    }),
    /////
    updateMyProfile: builder.mutation({
      query: (body) => ({ url: "/me", method: "PATCH", body }),
      invalidatesTags: (result) => (result ? ["Profile"] : []),
    }),
    /////
    changeMyPassword: builder.mutation({
      query: (body) => ({ url: "/me/password", method: "PATCH", body }),
    }),
    /////
    updateAccountStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/accounts/status/${encodeURIComponent(id)}`,
        method: "PATCH",
        body: { status },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useVerifyInviteQuery,
  useAcceptInviteMutation,
  useLogoutMutation,
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useChangeMyPasswordMutation,
  useUpdateAccountStatusMutation,
} = authApi;
