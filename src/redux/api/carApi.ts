// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const carApi = createApi({
  reducerPath: "carApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL
      ? `${import.meta.env.VITE_API_URL}/v1`
      : "http://localhost:8000/api/v1",
  }),
  tagTypes: ["StoreCarData"],
  endpoints: (builder) => ({
    getAllCar: builder.query({
      query: () => `/Cars`,
      providesTags: ["StoreCarData"],
    }),
  }),
});

export const { useGetAllCarQuery } = carApi;
