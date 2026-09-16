import { Navigate, Outlet } from "react-router-dom";
import Loader from "../components/shared/Loader";
import { ROLE_HOME } from "../configs/constants";
import { getDashboardRole } from "../utils/roleHelper";
import { useAuthUser } from "./useAuthUser";

// only this role gets through
const ProtectedRoute = ({ role }) => {
  const { user, isChecking } = useAuthUser();
  if (isChecking) return <Loader />;
  if (!user) return <Navigate to="/signin" replace />;
  const dashboardRole = getDashboardRole(user);
  if (dashboardRole !== role) return <Navigate to={ROLE_HOME[dashboardRole] ?? "/signin"} replace />;
  return <Outlet />;
};

export default ProtectedRoute;
