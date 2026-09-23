import { useEffect } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Dropdown from "./Dropdown";
import Button from "./Button";
import CountBadge from "./CountBadge";
import { readNotification } from "../../utils/notificationCatalog";
import { formatRelativeTime } from "../../utils/formatTime";
import { onSocketEvent } from "../../utils/socket";
import { SOCKET_EVENTS } from "../../configs/constants";
import {
  receiveNotification,
  useGetMyNotificationsQuery,
  useMarkNotificationReadMutation,
} from "../../store/apis/shared/notification.apis";

const RECENT_LIMIT = 5;

const NotificationBell = ({ type = "admin" }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data } = useGetMyNotificationsQuery();
  const [markNotificationRead] = useMarkNotificationReadMutation();

  // socket payload lands in cache
  useEffect(
    () =>
      onSocketEvent(SOCKET_EVENTS.NOTIFICATION_NEW, ({ notification } = {}) =>
        dispatch(receiveNotification(notification)),
      ),
    [dispatch],
  );

  const notificationsPath = `/${type}/dashboard/notifications`;
  const notifications = data?.data?.notifications ?? [];
  const unreadCount = data?.data?.unreadCount ?? 0;
  const recent = notifications.slice(0, RECENT_LIMIT);
  const unreadLabel = unreadCount > 99 ? "99+" : unreadCount;

  const handleSelect = async (notification) => {
    navigate(notificationsPath);
    if (notification?.isRead) return;

    try {
      await markNotificationRead(notification?._id).unwrap();
    } catch (error) {
      console.error("Mark notification read error:", error);
    }
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

          <CountBadge count={unreadCount} className="absolute -right-1.5 -top-1.5" />
        </span>
      }
    >
      <div className="flex items-center justify-between border-b color-border px-4 py-3">
        <p className="text-sm font-medium text-tertiary">Notifications</p>

        {unreadCount > 0 && (
          <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-600">{unreadLabel} unread</span>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto">
        {recent.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-muted">No notifications yet</p>
        ) : (
          recent.map((notification) => {
            const { icon: Icon, style, title } = readNotification(notification);

            return (
              <button
                key={notification._id}
                type="button"
                onClick={() => handleSelect(notification)}
                className={`flex w-full cursor-pointer items-start gap-3 px-4 py-3 text-left transition hover:bg-gray-50 ${
                  notification.isRead ? "bg-white" : "bg-blue-50/40"
                }`}
              >
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style}`}>
                  <Icon size={16} />
                </span>

                {/* the page carries the details */}
                <span className="min-w-0 flex-1">
                  <span className="flex items-start gap-2">
                    <span className="line-clamp-2 text-xs font-medium text-tertiary">{title}</span>
                    {!notification.isRead && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />}
                  </span>

                  <span className="mt-1 block text-[11px] text-muted">
                    {formatRelativeTime(notification.createdAt)}
                  </span>
                </span>
              </button>
            );
          })
        )}
      </div>

      <div className="border-t color-border p-2">
        <Button
          variant="bare"
          onClick={() => navigate(notificationsPath)}
          className="w-full rounded-lg py-2 text-center text-sm font-medium text-(--color-primary) hover:bg-gray-50"
        >
          View all notifications
        </Button>
      </div>
    </Dropdown>
  );
};

export default NotificationBell;
