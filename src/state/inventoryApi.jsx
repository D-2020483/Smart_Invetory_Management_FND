import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const inventoryApi = createApi({
  reducerPath: 'inventoryApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api/inventory' }),
  tagTypes: ['Inventory'],
  endpoints: (builder) => ({
    getInventoryItems: builder.query({
      query: ({ page, limit, search, category, status }) => {
        const params = new URLSearchParams();
        if (page) params.append('page', page);
        if (limit) params.append('limit', limit);
        if (search) params.append('search', search);
        if (category) params.append('category', category);
        if (status) params.append('status', status);
        return `/?${params.toString()}`;
      },
      providesTags: ['Inventory'],
    }),
    
    createInventoryItem: builder.mutation({
      query: (formData) => ({
        url: '/',
        method: 'POST',
        body: formData, 
      }),
      invalidatesTags: ['Inventory'],
    }),

    getInventoryById: builder.query({
      query: (id) => '/${id}',
      providesTags: ['Inventory'],
    }),

    updateInventoryItem: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['Inventory'],
    }),

    deleteInventoryItem: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Inventory'],
    }),
  }),
})

export const { 
  useGetInventoryItemsQuery,
  useCreateInventoryItemMutation,
  useUpdateInventoryItemMutation,
  useDeleteInventoryItemMutation,
  useGetInventoryByIdQuery,
  } = inventoryApi