import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getEnv } from "../../../configs/env";

export const clientDashboardApi = createApi({
  reducerPath: "clientDashboardApi",

  baseQuery: fetchBaseQuery({ baseUrl: `${getEnv("VITE_SERVER_URL")}/api/client/dashboard`, credentials: "include" }),
  tagTypes: ["ClientDashboard"],
  endpoints: (builder) => ({
    /////
    getClientDashboardStats: builder.query({
      query: () => "",
      providesTags: ["ClientDashboard"],
    }),
  }),
});

export const { useGetClientDashboardStatsQuery } = clientDashboardApi;
