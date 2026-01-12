import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const allProductsApi = createApi({
  reducerPath: "allProductsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL
      ? `${import.meta.env.VITE_API_URL}/v1`
      : "http://localhost:8000/api/v1",
  }),
  endpoints: (build) => ({
    getCar: build.query({
      query: () => `/cars`,
    }),
  }),
});

export const { useGetCarQuery } = allProductsApi;
