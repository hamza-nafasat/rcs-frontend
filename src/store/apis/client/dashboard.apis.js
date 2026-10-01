import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getEnv } from "../../../configs/env";

export const clientDashboardApi = createApi({
  reducerPath: "clientDashboardApi",

  baseQuery: fetchBaseQuery({ baseUrl: `${getEnv("VITE_SERVER_URL")}/api/client/dashboard`, credentials: "include" }),
  tagTypes: ["ClientDashboard"],
  endpoints: (builder) => ({
    /////
    getClientDashboardStats: builder.query({
      // charts group by my months
      query: () => ({ url: "", params: { tz: Intl.DateTimeFormat().resolvedOptions().timeZone } }),
      providesTags: ["ClientDashboard"],
    }),
  }),
});

export const { useGetClientDashboardStatsQuery } = clientDashboardApi;
