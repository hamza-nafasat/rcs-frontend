import { Navigate, Outlet } from "react-router-dom";
import { ROLE_HOME, USER_ROLES } from "../configs/constants";
import { getDashboardRole } from "../utils/roleHelper";
import { useAuthUser } from "./useAuthUser";

// a moderator goes back home
const NoModeratorRoute = () => {
  const { user } = useAuthUser();
  if (user?.role === USER_ROLES.MODERATOR) return <Navigate to={ROLE_HOME[getDashboardRole(user)] ?? "/signin"} replace />;
  return <Outlet />;
};

export default NoModeratorRoute;
