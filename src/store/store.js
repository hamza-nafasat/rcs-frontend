import { configureStore } from "@reduxjs/toolkit";
import notificationsReducer from "./slices/notificationsSlice";
import { authApi } from "./apis/auth.apis";

export const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    [authApi.reducerPath]: authApi.reducer,
  },

  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware),
});
