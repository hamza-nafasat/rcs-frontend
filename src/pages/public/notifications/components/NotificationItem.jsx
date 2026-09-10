import { Check, Trash2 } from "lucide-react";
import { TYPE_STYLES, getTypeIcon } from "../utils/notificationTypes";

const NotificationItem = ({ notification, onMarkRead, onDelete }) => {
  const { title, description, time, type, isRead } = notification;

  return (
    <article
      className={`flex items-start gap-4 rounded-2xl border color-border p-4 transition ${
        isRead ? "bg-white" : "bg-blue-50/40"
      }`}
    >
      {/* Icon */}
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          TYPE_STYLES[type] ?? TYPE_STYLES.system
        }`}
      >
        {getTypeIcon(type)}
      </span>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium text-gray-900">{title}</p>

          {!isRead && <span className="h-2 w-2 rounded-full bg-blue-500" />}
        </div>

        <p className="mt-1 text-sm text-secondary">{description}</p>

        <p className="mt-2 text-xs text-muted">{time}</p>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1">
        {!isRead && (
          <button
            type="button"
            onClick={() => onMarkRead?.(notification.id)}
            className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Mark as read"
            title="Mark as read"
          >
            <Check size={16} />
          </button>
        )}

        <button
          type="button"
          onClick={() => onDelete?.(notification.id)}
          className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-red-600"
          aria-label="Delete notification"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </article>
  );
};

export default NotificationItem;
