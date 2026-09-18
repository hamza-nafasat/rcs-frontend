import { configureStore } from "@reduxjs/toolkit";
import { clientApi } from "./apis/admin/client.apis";
import { authApi } from "./apis/shared/auth.apis";
import { fddApi } from "./apis/shared/fdd.apis";
import { messageApi } from "./apis/shared/message.apis";
import { moderatorApi } from "./apis/shared/moderator.apis";
import { notificationApi } from "./apis/shared/notification.apis";
import { activityApi } from "./apis/admin/activity.apis";
import { dashboardApi } from "./apis/admin/dashboard.apis";
import { clientDashboardApi } from "./apis/client/dashboard.apis";
import { franchiseeApi } from "./apis/client/franchisee.apis";
import { pipelineApi } from "./apis/shared/pipeline.apis";
import { supportApi } from "./apis/shared/support.apis";
import { apiErrorToast, resetOnUserChange } from "./utils/store.utils";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [clientApi.reducerPath]: clientApi.reducer,
    [fddApi.reducerPath]: fddApi.reducer,
    [messageApi.reducerPath]: messageApi.reducer,
    [moderatorApi.reducerPath]: moderatorApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [activityApi.reducerPath]: activityApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [clientDashboardApi.reducerPath]: clientDashboardApi.reducer,
    [franchiseeApi.reducerPath]: franchiseeApi.reducer,
    [pipelineApi.reducerPath]: pipelineApi.reducer,
    [supportApi.reducerPath]: supportApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      clientApi.middleware,
      fddApi.middleware,
      messageApi.middleware,
      moderatorApi.middleware,
      notificationApi.middleware,
      activityApi.middleware,
      dashboardApi.middleware,
      clientDashboardApi.middleware,
      franchiseeApi.middleware,
      pipelineApi.middleware,
      supportApi.middleware,
      apiErrorToast,
      resetOnUserChange,
    ),
});
