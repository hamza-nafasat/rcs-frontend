import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getEnv } from "../../../configs/env";

export const supportApi = createApi({
  reducerPath: "supportApi",

  baseQuery: fetchBaseQuery({ baseUrl: `${getEnv("VITE_SERVER_URL")}/api/supports`, credentials: "include" }),
  tagTypes: ["Supports", "singleSupport"],
  endpoints: (builder) => ({
    /////
    getAllSupports: builder.query({
      query: (params = {}) => ({ url: "", params }),
      providesTags: ["Supports"],
    }),
    /////
    getSupportById: builder.query({
      query: (id) => `/${encodeURIComponent(id)}`,
      providesTags: (_result, _error, id) => [{ type: "singleSupport", id }],
    }),
    /////
    createSupport: builder.mutation({
      query: (body) => ({ url: "", method: "POST", body }),
      invalidatesTags: ["Supports"],
    }),
    /////
    updateSupport: builder.mutation({
      query: ({ id, body }) => ({ url: `/${encodeURIComponent(id)}`, method: "PATCH", body }),
      invalidatesTags: (_result, _error, { id }) => ["Supports", { type: "singleSupport", id }],
    }),
    /////
    updateSupportStatus: builder.mutation({
      query: ({ id, status }) => ({ url: `/${encodeURIComponent(id)}/status`, method: "PATCH", body: { status } }),
      invalidatesTags: (_result, _error, { id }) => ["Supports", { type: "singleSupport", id }],
    }),
    /////
    deleteSupport: builder.mutation({
      query: (id) => ({ url: `/${encodeURIComponent(id)}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => ["Supports", { type: "singleSupport", id }],
    }),
  }),
});

export const {
  useGetAllSupportsQuery,
  useGetSupportByIdQuery,
  useCreateSupportMutation,
  useUpdateSupportMutation,
  useUpdateSupportStatusMutation,
  useDeleteSupportMutation,
} = supportApi;
