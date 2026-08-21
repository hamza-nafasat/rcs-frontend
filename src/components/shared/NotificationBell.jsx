import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Dropdown from "./Dropdown";
import Button from "./Button";
import { useNotifications } from "../../context/useNotifications";
import {
  TYPE_STYLES,
  getTypeIcon,
} from "../../pages/notifications/notificationTypes";

const RECENT_LIMIT = 5;

const NotificationBell = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markRead } = useNotifications();

  const recent = notifications.slice(0, RECENT_LIMIT);

  const handleSelect = (notification) => {
    markRead(notification.id);
    navigate("/dashboard/notifications");
  };

  return (
    <Dropdown
      portalClassName="w-80 max-w-[calc(100vw-1rem)] p-0! overflow-hidden"
      trigger={
        <span
          className="relative flex items-center justify-center rounded-xl border border-[#E8E8E8] p-2 text-secondary hover:bg-gray-50"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={20} />

          {unreadCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium leading-none text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </span>
      }
    >
      <div className="flex items-center justify-between border-b color-border px-4 py-3">
        <p className="text-sm font-medium text-tertiary">Notifications</p>

        {unreadCount > 0 && (
          <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-600">
            {unreadCount > 99 ? "99+" : unreadCount} unread
          </span>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto">
        {recent.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-muted">
            No notifications yet
          </p>
        ) : (
          recent.map((notification) => (
            <button
              key={notification.id}
              type="button"
              onClick={() => handleSelect(notification)}
              className={`flex w-full cursor-pointer items-start gap-3 px-4 py-3 text-left transition hover:bg-gray-50 ${
                notification.isRead ? "bg-white" : "bg-blue-50/40"
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  TYPE_STYLES[notification.type] ?? TYPE_STYLES.system
                }`}
              >
                {getTypeIcon(notification.type, 16)}
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium text-gray-900">
                    {notification.title}
                  </span>

                  {!notification.isRead && (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                  )}
                </span>

                <span className="mt-0.5 line-clamp-2 block text-xs text-secondary">
                  {notification.description}
                </span>

                <span className="mt-1 block text-[11px] text-muted">
                  {notification.time}
                </span>
              </span>
            </button>
          ))
        )}
      </div>

      <div className="border-t color-border p-2">
        <Button
          type="icon"
          onClick={() => navigate("/dashboard/notifications")}
          className="w-full rounded-lg py-2 text-center text-sm font-medium text-(--color-primary) hover:bg-gray-50"
        >
          View all notifications
        </Button>
      </div>
    </Dropdown>
  );
};

export default NotificationBell;
