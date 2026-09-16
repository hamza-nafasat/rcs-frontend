import { Navigate, Outlet } from "react-router-dom";
import Loader from "../components/shared/Loader";
import { ROLE_HOME } from "../configs/constants";
import { getDashboardRole } from "../utils/roleHelper";
import { useAuthUser } from "./useAuthUser";

// signed in users go home
const GuestRoute = () => {
  const { user, isChecking } = useAuthUser();
  if (isChecking) return <Loader />;
  const home = ROLE_HOME[getDashboardRole(user)];
  if (user && home) return <Navigate to={home} replace />;
  return <Outlet />;
};

export default GuestRoute;
