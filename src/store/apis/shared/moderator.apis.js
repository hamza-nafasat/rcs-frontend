import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getEnv } from "../../../configs/env";

export const moderatorApi = createApi({
  reducerPath: "moderatorApi",

  baseQuery: fetchBaseQuery({ baseUrl: `${getEnv("VITE_SERVER_URL")}/api/moderators`, credentials: "include" }),
  tagTypes: ["Moderators", "singleModerator"],
  endpoints: (builder) => ({
    /////
    getAllModerators: builder.query({
      query: () => "",
      providesTags: ["Moderators"],
    }),
    /////
    getModeratorById: builder.query({
      query: (id) => `/${encodeURIComponent(id)}`,
      providesTags: (_result, _error, id) => [{ type: "singleModerator", id }],
    }),
    /////
    createModerator: builder.mutation({
      query: (body) => ({ url: "", method: "POST", body }),
      invalidatesTags: ["Moderators"],
    }),
    /////
    updateModerator: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/${encodeURIComponent(id)}`, method: "PATCH", body }),
      invalidatesTags: (_result, _error, { id }) => ["Moderators", { type: "singleModerator", id }],
    }),
    /////
    deleteModerator: builder.mutation({
      query: (id) => ({ url: `/${encodeURIComponent(id)}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => ["Moderators", { type: "singleModerator", id }],
    }),
  }),
});

export const {
  useGetAllModeratorsQuery,
  useGetModeratorByIdQuery,
  useCreateModeratorMutation,
  useUpdateModeratorMutation,
  useDeleteModeratorMutation,
} = moderatorApi;
