import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NotificationHeading from "./components/NotificationHeading";
import NotificationTabs from "./components/NotificationTabs";
import NotificationList from "./components/NotificationList";
import { notificationsForRole } from "../../../utils/notificationCatalog";
import { getDashboardRole } from "../../../utils/roleHelper";
import { useAuthUser } from "../../../routes/useAuthUser";
import {
  markAllRead,
  markRead,
  removeNotification,
  selectNotifications,
} from "../../../store/slices/notificationsSlice";

const Notifications = () => {
  const { user } = useAuthUser();
  const notifications = useSelector(selectNotifications);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("all");

  // each role reads its own events
  const myNotifications = notificationsForRole(notifications, getDashboardRole(user));
  const unreadCount = myNotifications.filter((item) => !item.isRead).length;

  const filteredNotifications = myNotifications.filter((item) => {
    if (activeTab === "unread") return !item.isRead;
    if (activeTab === "read") return item.isRead;
    return true;
  });

  return (
    <section className="flex h-full min-h-0 flex-col">
      <div className="border-b color-border py-4">
        <NotificationHeading
          heading="Notifications"
          subheading="Stay updated with the latest activity across the franchise platform."
          unreadCount={unreadCount}
          onMarkAllRead={() => dispatch(markAllRead())}
        />
      </div>

      <div className="mt-6">
        <NotificationTabs activeTab={activeTab} setActiveTab={setActiveTab} unreadCount={unreadCount} />
      </div>

      <div className="mt-6 min-h-0 flex-1 overflow-y-auto">
        <NotificationList
          notifications={filteredNotifications}
          onMarkRead={(id) => dispatch(markRead(id))}
          onDelete={(id) => dispatch(removeNotification(id))}
        />
      </div>
    </section>
  );
};

export default Notifications;
