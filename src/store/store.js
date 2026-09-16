import { configureStore } from "@reduxjs/toolkit";
import { clientApi } from "./apis/admin/client.apis";
import { authApi } from "./apis/shared/auth.apis";
import { fddApi } from "./apis/shared/fdd.apis";
import { messageApi } from "./apis/shared/message.apis";
import { moderatorApi } from "./apis/shared/moderator.apis";
import notificationsReducer from "./slices/notificationsSlice";
import { apiErrorToast, resetOnUserChange } from "./utils/store.utils";

export const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    [authApi.reducerPath]: authApi.reducer,
    [clientApi.reducerPath]: clientApi.reducer,
    [fddApi.reducerPath]: fddApi.reducer,
    [messageApi.reducerPath]: messageApi.reducer,
    [moderatorApi.reducerPath]: moderatorApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      clientApi.middleware,
      fddApi.middleware,
      messageApi.middleware,
      moderatorApi.middleware,
      apiErrorToast,
      resetOnUserChange,
    ),
});
