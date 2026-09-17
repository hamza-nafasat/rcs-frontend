import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getEnv } from "../../../configs/env";

export const pipelineApi = createApi({
  reducerPath: "pipelineApi",

  baseQuery: fetchBaseQuery({ baseUrl: `${getEnv("VITE_SERVER_URL")}/api/pipelines`, credentials: "include" }),
  tagTypes: ["Pipelines", "singlePipeline", "PipelineRequests"],
  endpoints: (builder) => ({
    /////
    getAllPipelines: builder.query({
      query: (params = {}) => ({ url: "", params }),
      providesTags: ["Pipelines"],
    }),
    /////
    getPipelineById: builder.query({
      query: (id) => `/${encodeURIComponent(id)}`,
      providesTags: (_result, _error, id) => [{ type: "singlePipeline", id }],
    }),
    /////
    updatePipelineStage: builder.mutation({
      query: ({ id, stage }) => ({ url: `/${encodeURIComponent(id)}/stage`, method: "PATCH", body: { stage } }),
      invalidatesTags: (_result, _error, { id }) => ["Pipelines", { type: "singlePipeline", id }],
    }),
    /////
    getPipelineRequests: builder.query({
      query: (id) => `/${encodeURIComponent(id)}/requests`,
      providesTags: (_result, _error, id) => [{ type: "PipelineRequests", id }],
    }),
    /////
    createPipelineRequest: builder.mutation({
      query: ({ id, body }) => ({ url: `/${encodeURIComponent(id)}/requests`, method: "POST", body }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "PipelineRequests", id }],
    }),
    /////
    updatePipelineRequest: builder.mutation({
      query: ({ requestId, body }) => ({
        url: `/requests/${encodeURIComponent(requestId)}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "PipelineRequests", id }],
    }),
    /////
    respondToPipelineRequest: builder.mutation({
      query: ({ requestId, body }) => ({
        url: `/requests/${encodeURIComponent(requestId)}/response`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "PipelineRequests", id }],
    }),
    /////
    deletePipelineRequest: builder.mutation({
      query: ({ requestId }) => ({ url: `/requests/${encodeURIComponent(requestId)}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "PipelineRequests", id }],
    }),
    /////
    assignPipelineLocation: builder.mutation({
      query: ({ id, franchise }) => ({
        url: `/${encodeURIComponent(id)}/assign-location`,
        method: "POST",
        body: franchise,
      }),
      invalidatesTags: (_result, _error, { id }) => ["Pipelines", { type: "singlePipeline", id }],
    }),
  }),
});

export const {
  useGetAllPipelinesQuery,
  useGetPipelineByIdQuery,
  useUpdatePipelineStageMutation,
  useGetPipelineRequestsQuery,
  useCreatePipelineRequestMutation,
  useUpdatePipelineRequestMutation,
  useRespondToPipelineRequestMutation,
  useDeletePipelineRequestMutation,
  useAssignPipelineLocationMutation,
} = pipelineApi;
