import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import inventorySlice from './slices/inventorySlice';
import themeSlice from './slices/themeSlice';
import { authApi } from '@/state/api';
import { inventoryApi } from '@/state/inventoryApi';



export const store = configureStore({
  reducer: {
    auth: authSlice,
    inventory: inventorySlice,
    theme: themeSlice,

    [authApi.reducerPath]: authApi.reducer,
    [inventoryApi.reducerPath]: inventoryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
  .concat(authApi.middleware)
  .concat(inventoryApi.middleware),
  
    
});
