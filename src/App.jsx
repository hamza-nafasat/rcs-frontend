import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/auth/SignIn";
import Login from "./pages/auth/Login";
import Singup from "./pages/auth/Singup";
import ForgetPassword from "./pages/auth/ForgetPassword";
import CheckEmail from "./pages/auth/CheckEmail";
import PasswordReset from "./pages/auth/PasswordReset";
import Dashboard from "./components/layouts/Dashboard";
import DashboardNotFound from "./components/layouts/DashboardNotFound";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Singup />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/password-reset" element={<PasswordReset />} />

        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<h2 className="heading-lg">Dashboard</h2>} />
          <Route path="*" element={<DashboardNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
