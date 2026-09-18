import { isAnyOf, isRejectedWithValue } from "@reduxjs/toolkit";
import { authApi } from "../apis/shared/auth.apis";
import { clientApi } from "../apis/admin/client.apis";
import { fddApi } from "../apis/shared/fdd.apis";
import { messageApi } from "../apis/shared/message.apis";
import { moderatorApi } from "../apis/shared/moderator.apis";
import { notificationApi } from "../apis/shared/notification.apis";
import { activityApi } from "../apis/admin/activity.apis";
import { dashboardApi } from "../apis/admin/dashboard.apis";
import { franchiseeApi } from "../apis/client/franchisee.apis";
import { pipelineApi } from "../apis/shared/pipeline.apis";
import { supportApi } from "../apis/shared/support.apis";
import toast from "react-hot-toast";

// clear caches when the user changes
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
    storeApi.dispatch(fddApi.util.resetApiState());
    storeApi.dispatch(messageApi.util.resetApiState());
    storeApi.dispatch(moderatorApi.util.resetApiState());
    storeApi.dispatch(notificationApi.util.resetApiState());
    storeApi.dispatch(activityApi.util.resetApiState());
    storeApi.dispatch(dashboardApi.util.resetApiState());
    storeApi.dispatch(franchiseeApi.util.resetApiState());
    storeApi.dispatch(pipelineApi.util.resetApiState());
    storeApi.dispatch(supportApi.util.resetApiState());
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
