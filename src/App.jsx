import { useEffect } from "react";
import { useDispatch } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import { useAuthUser } from "./routes/useAuthUser";
import { connectSocket, disconnectSocket, onSocketEvent } from "./utils/socket";
import { SOCKET_EVENTS } from "./configs/constants";
import { refreshForNotification } from "./store/utils/notificationSync";

const App = () => {
  const { user } = useAuthUser();
  const dispatch = useDispatch();
  const accountId = user?._id;

  // the socket follows the account
  useEffect(() => {
    if (!accountId) return;
    connectSocket();
    return () => disconnectSocket();
  }, [accountId]);

  // a notification refreshes its module
  useEffect(() => {
    if (!accountId) return;
    return onSocketEvent(SOCKET_EVENTS.NOTIFICATION_NEW, ({ notification } = {}) =>
      refreshForNotification(dispatch, notification?.kind),
    );
  }, [accountId, dispatch]);

  return <AppRoutes />;
};

export default App;
