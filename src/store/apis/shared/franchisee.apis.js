import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getEnv } from "../../../configs/env";

export const franchiseeApi = createApi({
  reducerPath: "franchiseeApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${getEnv("VITE_SERVER_URL")}/api/franchisees`,
    credentials: "include",
  }),
  tagTypes: ["Franchisees", "singleFranchisee"],
  endpoints: (builder) => ({
    /////
    getAllFranchisees: builder.query({
      query: (params = {}) => ({ url: "", params }),
      providesTags: ["Franchisees"],
    }),
    /////
    getFranchiseeById: builder.query({
      query: (id) => `/${encodeURIComponent(id)}`,
      providesTags: (_result, _error, id) => [{ type: "singleFranchisee", id }],
    }),
  }),
});

export const { useGetAllFranchiseesQuery, useGetFranchiseeByIdQuery } = franchiseeApi;
