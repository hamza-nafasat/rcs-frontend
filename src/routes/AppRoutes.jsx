import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";

import SignIn from "../pages/shared/auth/SignIn";
import ForgetPassword from "../pages/shared/auth/ForgetPassword";
import CheckEmail from "../pages/shared/auth/CheckEmail";
import ResetPassword from "../pages/shared/auth/ResetPassword";
import Dashboard from "../components/layouts/Dashboard";
import DashboardNotFound from "../components/layouts/DashboardNotFound";
import AdminDashboard from "../pages/admin/dashboard/AdminDashboard";
import ClientManagement from "../pages/admin/client-management/ClientManagement";
import AdminModerators from "../pages/admin/moderators/AdminModerators";
import AdminFdd from "../pages/admin/fdd/AdminFdd";
import ResetPasswordSuccess from "../pages/shared/auth/ResetPasswordSuccess";
import AdminSupport from "../pages/admin/support/AdminSupport";
import Settings from "../pages/shared/settings/Settings";
import Notifications from "../pages/shared/notifications/Notifications";
import Messages from "../pages/shared/messages/Messages";
import AdminPipeline from "../pages/admin/pipeline/AdminPipeline";
import AdminApplicantDetailPage from "../pages/admin/pipeline/AdminApplicantDetailPage";
import ViewAllActivity from "../pages/admin/view-all-activity/ViewAllActivity";
import CreateAccount from "../pages/shared/auth/CreateAccount";
import ClientDashboard from "../pages/client/dashboard/ClientDashboard";
import ClientPipeline from "../pages/client/pipeline/ClientPipeline";
import ClientApplicantDetailPage from "../pages/client/pipeline/ClientApplicantDetailPage";
import Reports from "../pages/client/reports/Reports";
import ClientFdd from "../pages/client/fdd/ClientFDD";
import ClientModerators from "../pages/client/moderators/ClientModerators";
import ClientSupport from "../pages/client/support/ClientSupport";
import Application from "../pages/user/application/Application";
import Franchisee from "../pages/shared/franchisee/Franchisee";

import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";
import NoModeratorRoute from "./NoModeratorRoute";
import { USER_ROLES } from "../configs/constants";

const LegacyAdminRedirect = () => {
  const { pathname } = useLocation();
  const next = pathname.replace(/^\/dashboard/, "/admin/dashboard");
  return <Navigate to={next} replace />;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        {/* non authentic users */}
        <Route element={<GuestRoute />}>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/check-email" element={<CheckEmail />} />
          <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
          <Route path="/reset-password-success" element={<ResetPasswordSuccess />} />
          <Route path="/accept-invite/:inviteToken" element={<CreateAccount />} />
        </Route>

        <Route path="/dashboard/*" element={<LegacyAdminRedirect />} />
        <Route path="/sign-in" element={<Navigate to="/signin" replace />} />
        {/* admin only */}
        <Route element={<ProtectedRoute role={USER_ROLES.ADMIN} />}>
          <Route path="/admin/dashboard" element={<Dashboard type="admin" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="clients" element={<ClientManagement />} />
            <Route path="messages" element={<Messages />} />
            <Route element={<NoModeratorRoute />}>
              <Route path="moderators" element={<AdminModerators />} />
            </Route>
            <Route path="fdd" element={<AdminFdd />} />
            <Route path="franchisee" element={<Franchisee />} />
            <Route path="support" element={<AdminSupport />} />
            <Route path="settings" element={<Settings />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="pipeline" element={<AdminPipeline />} />
            <Route path="pipeline/:id" element={<AdminApplicantDetailPage />} />
            <Route path="view-all-activity" element={<ViewAllActivity />} />
          </Route>
        </Route>

        {/* client only */}
        <Route path="/client" element={<Navigate to="/client/dashboard" replace />} />
        <Route element={<ProtectedRoute role={USER_ROLES.CLIENT} />}>
          <Route path="/client/dashboard" element={<Dashboard type="client" />}>
            <Route index element={<ClientDashboard />} />
            {/* ClientPipeline */}
            <Route path="pipeline" element={<ClientPipeline />} />
            <Route path="pipeline/:id" element={<ClientApplicantDetailPage />} />
            <Route path="reports" element={<Reports />} />
            <Route path="fdd" element={<ClientFdd />} />
            <Route element={<NoModeratorRoute />}>
              <Route path="moderators" element={<ClientModerators />} />
            </Route>
            <Route path="settings" element={<Settings />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="support" element={<ClientSupport />} />
            <Route path="messages" element={<Messages />} />
            <Route path="franchisee" element={<Franchisee />} />
          </Route>
        </Route>

        {/* user only  */}
        <Route element={<ProtectedRoute role={USER_ROLES.USER} />}>
          <Route path="/user/dashboard" element={<Dashboard type="user" />}>
            <Route index element={<Application />} />
            <Route path="messages" element={<Messages />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<DashboardNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
