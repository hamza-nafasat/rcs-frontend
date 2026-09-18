import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getEnv } from "../../../configs/env";

export const activityApi = createApi({
  reducerPath: "activityApi",

  baseQuery: fetchBaseQuery({ baseUrl: `${getEnv("VITE_SERVER_URL")}/api/admin/activities`, credentials: "include" }),
  tagTypes: ["Activities"],
  endpoints: (builder) => ({
    /////
    getAllActivities: builder.query({
      query: (params = {}) => ({ url: "", params }),
      providesTags: ["Activities"],
    }),
  }),
});

export const { useGetAllActivitiesQuery } = activityApi;
