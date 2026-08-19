import { useState } from "react";
import { FileText, LifeBuoy, MessageSquare, Settings } from "lucide-react";
import NotificationHeading from "./components/NotificationHeading";
import NotificationTabs from "./components/NotificationTabs";
import NotificationList from "./components/NotificationList";

const initialNotifications = [
  {
    id: 1,
    type: "document",
    icon: <FileText size={18} />,
    title: "New FDD version uploaded",
    description: "Burger Hub FDD 2025 (v3.1) is ready for your review.",
    time: "10 minutes ago",
    isRead: false,
  },
  {
    id: 2,
    type: "support",
    icon: <LifeBuoy size={18} />,
    title: "Ticket TKT-1002 escalated",
    description: "Franchisee login not working has been marked urgent.",
    time: "1 hour ago",
    isRead: false,
  },
  {
    id: 3,
    type: "message",
    icon: <MessageSquare size={18} />,
    title: "New message from Pizza Corner",
    description: "You have 3 unread messages in the chat module.",
    time: "Yesterday",
    isRead: true,
  },
  {
    id: 4,
    type: "system",
    icon: <Settings size={18} />,
    title: "Company profile updated",
    description: "Your company contact details were changed successfully.",
    time: "2 days ago",
    isRead: true,
  },
];

const Notification = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeTab, setActiveTab] = useState("all");

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === "unread") return !item.isRead;
    if (activeTab === "read") return item.isRead;

    return true;
  });

  const handleMarkRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item)),
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
  };

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <section className="flex h-full min-h-0 flex-col">
      <div className="border-b color-border py-4">
        <NotificationHeading
          heading="Notifications"
          subheading="Stay updated with the latest activity across the franchise platform."
          unreadCount={unreadCount}
          onMarkAllRead={handleMarkAllRead}
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
          onMarkRead={handleMarkRead}
          onDelete={handleDelete}
        />
      </div>
    </section>
  );
};

export default Notification;
