import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { useAuthUser } from "./routes/useAuthUser";
import { connectSocket, disconnectSocket } from "./utils/socket";

const App = () => {
  const { user } = useAuthUser();
  const accountId = user?._id;

  // the socket follows the account
  useEffect(() => {
    if (!accountId) return;
    connectSocket();
    return () => disconnectSocket();
  }, [accountId]);

  return <AppRoutes />;
};

export default App;
