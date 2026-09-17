import { useState } from "react";
import toast from "react-hot-toast";
import NotificationHeading from "./components/NotificationHeading";
import NotificationTabs from "./components/NotificationTabs";
import NotificationList from "./components/NotificationList";
import Loader from "../../../components/shared/Loader";
import {
  useDeleteNotificationMutation,
  useGetMyNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from "../../../store/apis/shared/notification.apis";

const Notifications = () => {
  const { data, isLoading } = useGetMyNotificationsQuery();
  const [markNotificationRead] = useMarkNotificationReadMutation();
  const [markAllNotificationsRead, { isLoading: isMarkingAll }] = useMarkAllNotificationsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [activeTab, setActiveTab] = useState("all");

  const notifications = data?.data?.notifications ?? [];
  const unreadCount = data?.data?.unreadCount ?? 0;

  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === "unread") return !item.isRead;
    if (activeTab === "read") return item.isRead;
    return true;
  });

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id).unwrap();
    } catch (error) {
      console.error("Mark notification read error:", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const response = await markAllNotificationsRead().unwrap();
      toast.success(response?.message);
    } catch (error) {
      console.error("Mark all notifications read error:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteNotification(id).unwrap();
      toast.success(response?.message);
    } catch (error) {
      console.error("Delete notification error:", error);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <section className="flex h-full min-h-0 flex-col">
      <div className="border-b color-border py-4">
        <NotificationHeading
          heading="Notifications"
          subheading="Stay updated with the latest activity across the franchise platform."
          unreadCount={unreadCount}
          isLoading={isMarkingAll}
          onMarkAllRead={handleMarkAllRead}
        />
      </div>

      <div className="mt-6">
        <NotificationTabs activeTab={activeTab} setActiveTab={setActiveTab} unreadCount={unreadCount} />
      </div>

      <div className="mt-6 min-h-0 flex-1 overflow-y-auto">
        <NotificationList
          notifications={filteredNotifications}
          onMarkRead={handleMarkRead}
          onDelete={handleDelete}
        />
      </div>
    </section>
  );
};

export default Notifications;
