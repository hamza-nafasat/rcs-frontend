import { Navigate, Outlet } from "react-router-dom";
import Loader from "../components/shared/Loader";
import { ROLE_HOME } from "../configs/constants";
import { useAuthUser } from "./useAuthUser";

// signed in users go back to their own dashboard
const GuestRoute = () => {
  const { user, isChecking } = useAuthUser();
  if (isChecking) return <Loader />;
  if (user && ROLE_HOME[user?.role]) return <Navigate to={ROLE_HOME[user?.role]} replace />;
  return <Outlet />;
};

export default GuestRoute;
