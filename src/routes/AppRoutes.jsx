import { BrowserRouter, Route, Routes } from "react-router-dom";

import SignIn from "../pages/public/auth/SignIn";
import ForgetPassword from "../pages/public/auth/ForgetPassword";
import CheckEmail from "../pages/public/auth/CheckEmail";
import ResetPassword from "../pages/public/auth/ResetPassword";
import Dashboard from "../components/layouts/Dashboard";
import DashboardNotFound from "../components/layouts/DashboardNotFound";
import AdminDashboard from "../pages/admin/dashboard/AdminDashboard";
import { Navigate } from "react-router-dom";
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

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/reset-password-success"
          element={<ResetPasswordSuccess />}
        />
        <Route path="/create-account" element={<CreateAccount />} />

        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<AdminDashboard />} />
          <Route path="clients" element={<ClientManagement />} />
          <Route path="messages" element={<Messages />} />
          <Route path="moderators" element={<Moderators />} />
          <Route path="fdd" element={<FDD />} />
          <Route path="support" element={<Support />} />
          <Route path="settings" element={<Settings />} />
          <Route path="notifications" element={<Notification />} />
          <Route path="franchise-pipeline" element={<FranchisePipeline />} />
          <Route path="view-all-activity" element={<ViewAllActivity />} />
        </Route>
        <Route path="*" element={<DashboardNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
