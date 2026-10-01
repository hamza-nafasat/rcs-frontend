import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getEnv } from "../../../configs/env";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",

  baseQuery: fetchBaseQuery({ baseUrl: `${getEnv("VITE_SERVER_URL")}/api/admin/dashboard`, credentials: "include" }),
  tagTypes: ["Dashboard"],
  endpoints: (builder) => ({
    /////
    getDashboardStats: builder.query({
      // charts group by my months
      query: () => ({ url: "", params: { tz: Intl.DateTimeFormat().resolvedOptions().timeZone } }),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
