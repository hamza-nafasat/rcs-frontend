import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getEnv } from "../../../configs/env";

export const fddApi = createApi({
  reducerPath: "fddApi",

  baseQuery: fetchBaseQuery({ baseUrl: `${getEnv("VITE_SERVER_URL")}/api/fdds`, credentials: "include" }),
  tagTypes: ["Fdds", "singleFdd"],
  endpoints: (builder) => ({
    /////
    getAllFdds: builder.query({
      query: (params = {}) => ({ url: "", params }),
      providesTags: ["Fdds"],
    }),
    /////
    getFddById: builder.query({
      query: (id) => `/${encodeURIComponent(id)}`,
      providesTags: (_result, _error, id) => [{ type: "singleFdd", id }],
    }),
    /////
    createFdd: builder.mutation({
      query: (body) => ({ url: "", method: "POST", body }),
      invalidatesTags: ["Fdds"],
    }),
    /////
    updateFdd: builder.mutation({
      query: ({ id, body }) => ({ url: `/${encodeURIComponent(id)}`, method: "PATCH", body }),
      invalidatesTags: (_result, _error, { id }) => ["Fdds", { type: "singleFdd", id }],
    }),
    /////
    fillFdd: builder.mutation({
      query: ({ id, body }) => ({ url: `/${encodeURIComponent(id)}/fill`, method: "POST", body }),
      invalidatesTags: (_result, _error, { id }) => ["Fdds", { type: "singleFdd", id }],
    }),
    /////
    reviewFddFill: builder.mutation({
      query: ({ fillId, reviewStatus }) => ({
        url: `/fills/${encodeURIComponent(fillId)}`,
        method: "PATCH",
        body: { reviewStatus },
      }),
      invalidatesTags: ["Fdds"],
    }),
    /////
    resetFddFill: builder.mutation({
      query: (fillId) => ({ url: `/fills/${encodeURIComponent(fillId)}`, method: "DELETE" }),
      invalidatesTags: ["Fdds"],
    }),
    /////
    skipFddFillWait: builder.mutation({
      query: (fillId) => ({ url: `/fills/${encodeURIComponent(fillId)}/skip-wait`, method: "POST" }),
      invalidatesTags: ["Fdds"],
    }),
    /////
    deleteFdd: builder.mutation({
      query: (id) => ({ url: `/${encodeURIComponent(id)}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => ["Fdds", { type: "singleFdd", id }],
    }),
  }),
});

export const {
  useGetAllFddsQuery,
  useGetFddByIdQuery,
  useCreateFddMutation,
  useUpdateFddMutation,
  useFillFddMutation,
  useReviewFddFillMutation,
  useResetFddFillMutation,
  useSkipFddFillWaitMutation,
  useDeleteFddMutation,
} = fddApi;
