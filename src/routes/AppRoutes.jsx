import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";

import SignIn from "../pages/public/auth/SignIn";
import ForgetPassword from "../pages/public/auth/ForgetPassword";
import CheckEmail from "../pages/public/auth/CheckEmail";
import ResetPassword from "../pages/public/auth/ResetPassword";
import Dashboard from "../components/layouts/Dashboard";
import DashboardNotFound from "../components/layouts/DashboardNotFound";
import AdminDashboard from "../pages/admin/dashboard/AdminDashboard";
import ClientManagement from "../pages/admin/client-management/ClientManagement";
import MessagesView from "../components/global/messages/MessagesView";
import AdminModerators from "../pages/admin/moderators/AdminModerators";
import AdminFdd from "../pages/admin/fdd/AdminFdd";
import ResetPasswordSuccess from "../pages/public/auth/ResetPasswordSuccess";
import AdminSupport from "../pages/admin/support/AdminSupport";
import Settings from "../pages/public/settings/Settings";
import Notifications from "../pages/admin/notifications/Notifications";
import AdminPipeline from "../pages/admin/pipeline/AdminPipeline";
import AdminApplicantDetailPage from "../pages/admin/pipeline/AdminApplicantDetailPage";
import ViewAllActivity from "../pages/admin/view-all-activity/ViewAllActivity";
import CreateAccount from "../pages/public/auth/CreateAccount";
import ClientDashboard from "../pages/client/dashboard/ClientDashboard";
import ClientPipeline from "../pages/client/pipeline/ClientPipeline";
import ClientApplicantDetailPage from "../pages/client/pipeline/ClientApplicantDetailPage";
import Reports from "../pages/client/reports/Reports";
import ClientFdd from "../pages/client/fdd/ClientFdd";
import ClientModerators from "../pages/client/moderators/ClientModerators";
import ClientSupport from "../pages/client/support/ClientSupport";
import UserDashboard from "../pages/user/dashboard/UserDashboard";
import Franchisee from "../pages/client/franchisee/Franchisee";

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
          <Route path="messages" element={<MessagesView />} />
          <Route path="moderators" element={<AdminModerators />} />
          <Route path="fdd" element={<AdminFdd />} />
          <Route path="support" element={<AdminSupport />} />
          <Route path="settings" element={<Settings type="admin" />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="pipeline" element={<AdminPipeline />} />
          <Route path="pipeline/:id" element={<AdminApplicantDetailPage />} />
          <Route path="view-all-activity" element={<ViewAllActivity />} />
        </Route>

        <Route
          path="/client"
          element={<Navigate to="/client/dashboard" replace />}
        />
        <Route path="/client/dashboard" element={<Dashboard type="client" />}>
          <Route index element={<ClientDashboard />} />
          {/* ClientPipeline */}
          <Route path="pipeline" element={<ClientPipeline />} />
          <Route path="pipeline/:id" element={<ClientApplicantDetailPage />} />
          <Route path="reports" element={<Reports />} />
          <Route path="fdd" element={<ClientFdd />} />
          <Route path="moderators" element={<ClientModerators />} />
          <Route path="settings" element={<Settings type="client" />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="support" element={<ClientSupport />} />
          <Route path="messages" element={<MessagesView />} />
          <Route path="franchisee" element={<Franchisee />} />
        </Route>

        <Route path="/user/dashboard" element={<Dashboard type="user" />}>
          <Route index element={<UserDashboard />} />

        </Route>

        <Route path="*" element={<DashboardNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
