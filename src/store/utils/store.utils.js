import { isAnyOf, isRejectedWithValue } from "@reduxjs/toolkit";
import { authApi } from "../apis/shared/auth.apis";
import { clientApi } from "../apis/admin/client.apis";
import { moderatorApi } from "../apis/shared/moderator.apis";
import toast from "react-hot-toast";

// clear module caches when the signed in user changes
const isUserChange = isAnyOf(
  authApi.endpoints.login.matchFulfilled,
  authApi.endpoints.acceptInvite.matchFulfilled,
  authApi.endpoints.logout.matchFulfilled,
  authApi.endpoints.logout.matchRejected,
);
const resetOnUserChange = (storeApi) => (next) => (action) => {
  const result = next(action);
  if (isUserChange(action)) {
    storeApi.dispatch(clientApi.util.resetApiState());
    storeApi.dispatch(moderatorApi.util.resetApiState());
  }
  return result;
};

// show toast on each api error
const apiErrorToast = () => (next) => (action) => {
  const errorMessage = "Unable to reach the server, please try again";
  if (isRejectedWithValue(action) && action.meta?.arg?.type === "mutation")
    toast.error(action.payload?.data?.message ?? errorMessage);
  return next(action);
};

export { resetOnUserChange, apiErrorToast };
