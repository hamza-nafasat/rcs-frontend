import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getEnv } from "../../../configs/env";

export const pipelineApi = createApi({
  reducerPath: "pipelineApi",

  baseQuery: fetchBaseQuery({ baseUrl: `${getEnv("VITE_SERVER_URL")}/api/pipelines`, credentials: "include" }),
  tagTypes: ["Pipelines", "singlePipeline"],
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
  }),
});

export const { useGetAllPipelinesQuery, useGetPipelineByIdQuery, useUpdatePipelineStageMutation } = pipelineApi;
