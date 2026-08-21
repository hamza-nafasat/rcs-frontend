import { useState } from "react";
import NotificationHeading from "./components/NotificationHeading";
import NotificationTabs from "./components/NotificationTabs";
import NotificationList from "./components/NotificationList";
import { useNotifications } from "../../context/useNotifications";

const Notification = () => {
  const {
    notifications,
    unreadCount,
    markRead,
    markAllRead,
    removeNotification,
  } = useNotifications();
  const [activeTab, setActiveTab] = useState("all");

  const filteredNotifications = notifications.filter((item) => {
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
          onMarkAllRead={markAllRead}
        />
      </div>

      <div className="mt-6">
        <NotificationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          unreadCount={unreadCount}
        />
      </div>

      <div className="mt-6 min-h-0 flex-1 overflow-y-auto">
        <NotificationList
          notifications={filteredNotifications}
          onMarkRead={markRead}
          onDelete={removeNotification}
        />
      </div>
    </section>
  );
};

export default Notification;
