import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  currentPage: 1,
  searchQuery: '',
  categoryFilter: '',
  statusFilter: '',
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setCategoryFilter: (state, action) => {
      state.categoryFilter = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    deleteItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    deleteAllItems: (state) => {
      state.items = [];
    },
    updateAllPrices: (state, action) => {
      state.items = state.items.map((item) => ({
        ...item,
        price: action.payload,
      }));
    },
    updateAllStock: (state, action) => {
      state.items = state.items.map((item) => ({
        ...item,
        quantity: action.payload,
      }));
    },
  },
});

export const {
  setSearchQuery,
  setCategoryFilter,
  setStatusFilter,
  setCurrentPage,
  deleteItem,
  deleteAllItems,
  updateAllPrices,
  updateAllStock,
} = inventorySlice.actions;

export default inventorySlice.reducer;
