import { configureStore } from "@reduxjs/toolkit";
import { clientApi } from "./apis/admin/client.apis";
import { authApi } from "./apis/shared/auth.apis";
import notificationsReducer from "./slices/notificationsSlice";
import { apiErrorToast, resetOnUserChange } from "./utils/store.utils";

export const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    [authApi.reducerPath]: authApi.reducer,
    [clientApi.reducerPath]: clientApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, clientApi.middleware, apiErrorToast, resetOnUserChange),
});
