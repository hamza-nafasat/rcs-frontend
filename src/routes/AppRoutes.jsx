import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";

import SignIn from "../pages/public/auth/SignIn";
import ForgetPassword from "../pages/public/auth/ForgetPassword";
import CheckEmail from "../pages/public/auth/CheckEmail";
import ResetPassword from "../pages/public/auth/ResetPassword";
import Dashboard from "../components/layouts/Dashboard";
import DashboardNotFound from "../components/layouts/DashboardNotFound";
import AdminDashboard from "../pages/admin/dashboard/AdminDashboard";
import ClientManagement from "../pages/admin/client-management/ClientManagement";
import Messages from "../pages/admin/messages/Messages";
import Moderators from "../pages/admin/moderators/Moderators";
import FDD from "../pages/admin/fdd/FDD";
import ResetPasswordSuccess from "../pages/public/auth/ResetPasswordSuccess";
import Support from "../pages/admin/support/Support";
import Settings from "../pages/admin/settings/Settings";
import Notification from "../pages/admin/notifications/Notification";
import FranchisePipeline from "../pages/admin/franchise-pipeline/FranchisePipeline";
import ViewAllActivity from "../pages/admin/view-all-activity/ViewAllActivity";
import CreateAccount from "../pages/public/auth/CreateAccount";
import ClientDashboard from "../pages/client/dashboard/ClientDashboard";
import Pipeline from "../pages/client/pipeline/Pipeline";
import Report from "../pages/client/reports/Report";
import ClientFDD from "../pages/client/fdd/ClientFDD";
import ClientModerator from "../pages/client/moderators/ClientModerator";
import ClientSupport from "../pages/client/support/ClientSupport";

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
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/reset-password-success"
          element={<ResetPasswordSuccess />}
        />
        <Route path="/create-account" element={<CreateAccount />} />

        <Route path="/dashboard/*" element={<LegacyAdminRedirect />} />

        <Route path="/admin/dashboard" element={<Dashboard type="admin" />}>
          <Route index element={<AdminDashboard />} />
          <Route path="clients" element={<ClientManagement />} />
          <Route path="messages" element={<Messages />} />
          <Route path="moderators" element={<Moderators />} />
          <Route path="fdd" element={<FDD />} />
          <Route path="support" element={<Support />} />
          <Route path="settings" element={<Settings type="admin" />} />
          <Route path="notifications" element={<Notification />} />
          <Route path="franchise-pipeline" element={<FranchisePipeline />} />
          <Route path="view-all-activity" element={<ViewAllActivity />} />
        </Route>

        <Route path="/client" element={<Navigate to="/client/dashboard" replace />} />
        <Route path="/client/dashboard" element={<Dashboard type="client" />}>
          <Route index element={<ClientDashboard />} />
          {/* Pipeline */}
          <Route path="pipeline" element={<Pipeline />}/>
          <Route path="reports" element={<Report />}/>
          <Route path="fdd" element={<ClientFDD />}/>
          <Route path="moderators" element={<ClientModerator />}/>
          <Route path="settings" element={<Settings type="client" />} />
          <Route path="notifications" element={<Notification />} />
          <Route path="support" element={<ClientSupport />} />
          <Route path="messages" element={<Messages />} />
        </Route>

        <Route path="*" element={<DashboardNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
