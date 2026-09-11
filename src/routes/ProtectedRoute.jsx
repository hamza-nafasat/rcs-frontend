import { Navigate, Outlet } from "react-router-dom";
import Loader from "../components/shared/Loader";
import { ROLE_HOME } from "../configs/constants";
import { useAuthUser } from "./useAuthUser";

// only a signed in user of this role gets through
const ProtectedRoute = ({ role }) => {
  const { user, isChecking } = useAuthUser();
  if (isChecking) return <Loader />;
  if (!user) return <Navigate to="/signin" replace />;
  if (user?.role !== role) return <Navigate to={ROLE_HOME[user?.role] ?? "/signin"} replace />;
  return <Outlet />;
};

export default ProtectedRoute;
