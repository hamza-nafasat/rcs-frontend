import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getEnv } from "../../../configs/env";

export const reportApi = createApi({
  reducerPath: "reportApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${getEnv("VITE_SERVER_URL")}/api/client/reports`,
    credentials: "include",
  }),
  tagTypes: ["Report"],
  endpoints: (builder) => ({
    /////
    getReport: builder.query({
      query: (params = {}) => ({ url: "", params }),
      providesTags: ["Report"],
    }),
  }),
});

export const { useGetReportQuery } = reportApi;
