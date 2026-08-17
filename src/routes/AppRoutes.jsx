import { BrowserRouter, Route, Routes } from "react-router-dom";

import SignIn from "../pages/auth/SignIn";
import Login from "../pages/auth/Login";
import Singup from "../pages/auth/Singup";
import ForgetPassword from "../pages/auth/ForgetPassword";
import CheckEmail from "../pages/auth/CheckEmail";
import PasswordReset from "../pages/auth/PasswordReset";
import Dashboard from "../components/layouts/Dashboard";
import DashboardNotFound from "../components/layouts/DashboardNotFound";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import { Navigate } from "react-router-dom";
import ClientManagement from "../pages/client-management/ClientManagement";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Singup />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/reset-password" element={<PasswordReset />} />

        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<AdminDashboard />} />
          <Route path="clients" element={<ClientManagement />} />
          <Route path="*" element={<DashboardNotFound />} />
        </Route>
        <Route path="*" element={<DashboardNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
