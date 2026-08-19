import { BrowserRouter, Route, Routes } from "react-router-dom";

import SignIn from "../pages/auth/SignIn";
import ForgetPassword from "../pages/auth/ForgetPassword";
import CheckEmail from "../pages/auth/CheckEmail";
import ResetPassword from "../pages/auth/ResetPassword";
import Dashboard from "../components/layouts/Dashboard";
import DashboardNotFound from "../components/layouts/DashboardNotFound";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import { Navigate } from "react-router-dom";
import ClientManagement from "../pages/client-management/ClientManagement";
import Messages from "../pages/messages/Messages";
import Moderators from "../pages/moderators/Moderators";
import FDD from "../pages/fdd/FDD";
import ResetPasswordSuccess from "../pages/auth/ResetPasswordSuccess";
import Support from "../pages/support/Support";

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

        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<AdminDashboard />} />
          <Route path="clients" element={<ClientManagement />} />
          <Route path="messages" element={<Messages />} />
          <Route path="moderators" element={<Moderators />} />
          <Route path="fdd" element={<FDD />} />
          <Route path="support" element={<Support />} />
        </Route>
        <Route path="*" element={<DashboardNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
