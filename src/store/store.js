import { configureStore, isRejectedWithValue } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import notificationsReducer from "./slices/notificationsSlice";
import { authApi } from "./apis/auth.apis";

// show a toast for every failed mutation
const apiErrorToast = () => (next) => (action) => {
  if (isRejectedWithValue(action) && action.meta?.arg?.type === "mutation")
    toast.error(action.payload?.data?.message ?? "Unable to reach the server, please try again");
  return next(action);
};

export const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    [authApi.reducerPath]: authApi.reducer,
  },

  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware, apiErrorToast),
});
