import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getEnv } from "../../../configs/env";

export const clientApi = createApi({
  reducerPath: "clientApi",

  baseQuery: fetchBaseQuery({ baseUrl: `${getEnv("VITE_SERVER_URL")}/api/admin/clients`, credentials: "include" }),
  tagTypes: ["Clients", "singleClient"],
  endpoints: (builder) => ({
    /////
    getAllClients: builder.query({
      query: () => "",
      providesTags: ["Clients"],
    }),
    /////
    getClientById: builder.query({
      query: (id) => `/${encodeURIComponent(id)}`,
      providesTags: (_result, _error, id) => [{ type: "singleClient", id }],
    }),
    /////
    inviteClient: builder.mutation({
      query: (body) => ({ url: "/invite", method: "POST", body }),
      invalidatesTags: ["Clients"],
    }),
    /////
    resendClientInvite: builder.mutation({
      query: (id) => ({ url: `/resend-invite/${encodeURIComponent(id)}`, method: "POST" }),
    }),
    /////
    updateClient: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/${encodeURIComponent(id)}`, method: "PATCH", body }),
      invalidatesTags: (_result, _error, { id }) => ["Clients", { type: "singleClient", id }],
    }),
    /////
    deleteClient: builder.mutation({
      query: (id) => ({ url: `/${encodeURIComponent(id)}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => ["Clients", { type: "singleClient", id }],
    }),
  }),
});

export const {
  useGetAllClientsQuery,
  useGetClientByIdQuery,
  useInviteClientMutation,
  useResendClientInviteMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientApi;
