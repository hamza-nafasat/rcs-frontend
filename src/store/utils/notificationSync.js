import { activityApi } from "../apis/admin/activity.apis";
import { clientApi } from "../apis/admin/client.apis";
import { dashboardApi } from "../apis/admin/dashboard.apis";
import { clientDashboardApi } from "../apis/client/dashboard.apis";
import { franchiseeApi } from "../apis/shared/franchisee.apis";
import { reportApi } from "../apis/client/report.apis";
import { authApi } from "../apis/shared/auth.apis";
import { fddApi } from "../apis/shared/fdd.apis";
import { moderatorApi } from "../apis/shared/moderator.apis";
import { pipelineApi } from "../apis/shared/pipeline.apis";
import { supportApi } from "../apis/shared/support.apis";

// every cache a notification can stale
const CACHES = {
  activities: [activityApi, ["Activities"]],
  adminDashboard: [dashboardApi, ["Dashboard"]],
  clientDashboard: [clientDashboardApi, ["ClientDashboard"]],
  clients: [clientApi, ["Clients", "singleClient"]],
  fdds: [fddApi, ["Fdds", "singleFdd"]],
  franchisees: [franchiseeApi, ["Franchisees", "singleFranchisee"]],
  moderators: [moderatorApi, ["Moderators", "singleModerator"]],
  pipelines: [pipelineApi, ["Pipelines", "singlePipeline", "PipelineRequests"]],
  profile: [authApi, ["Profile"]],
  report: [reportApi, ["Report"]],
  supports: [supportApi, ["Supports", "singleSupport"]],
};

// any notification moves a dashboard number
const ALWAYS = ["activities", "adminDashboard", "clientDashboard"];

// the module each notification belongs to
const KIND_CACHES = {
  client_onboarded: ["clients"],
  ticket_raised: ["supports"],
  ticket_status_changed: ["supports"],
  fdd_filled: ["fdds"],
  fdd_received: ["fdds"],
  fdd_approved: ["fdds"],
  fdd_status_changed: ["fdds"],
  account_created: ["clients", "moderators"],
  profile_updated: ["profile", "clients"],
  pipeline_request_sent: ["pipelines"],
  pipeline_request_filled: ["pipelines"],
  pipeline_request_status_changed: ["pipelines"],
  pipeline_location_assigned: ["pipelines", "franchisees"],
  pipeline_application_received: ["pipelines", "franchisees", "report"],
  pipeline_application_new: ["pipelines", "franchisees", "report"],
  pipeline_stage_changed: ["pipelines", "franchisees", "report"],
};

// only screens in view refetch
const refreshForNotification = (dispatch, kind) => {
  const names = [...new Set([...(KIND_CACHES[kind] ?? []), ...ALWAYS])];

  names.forEach((name) => {
    const [api, tags] = CACHES[name];
    dispatch(api.util.invalidateTags(tags));
  });
};

export { KIND_CACHES, refreshForNotification };
