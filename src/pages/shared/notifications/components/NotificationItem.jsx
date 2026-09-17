import { Check, Trash2 } from "lucide-react";
import { readNotification } from "../../../../utils/notificationCatalog";
import { formatRelativeTime } from "../../../../utils/formatTime";

const NotificationItem = ({ notification, onMarkRead, onDelete }) => {
  const { icon: Icon, style, title, description } = readNotification(notification);
  const { _id, isRead, createdAt } = notification;

  return (
    <article
      className={`flex items-start gap-4 rounded-2xl border color-border p-4 transition ${
        isRead ? "bg-white" : "bg-blue-50/40"
      }`}
    >
      {/* Icon */}
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style}`}>
        <Icon size={18} />
      </span>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium text-tertiary">{title}</p>
          {!isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />}
        </div>

        {description && <p className="mt-1 text-sm text-secondary">{description}</p>}

        <p className="mt-2 text-xs text-muted">{formatRelativeTime(createdAt)}</p>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1">
        {!isRead && (
          <button
            type="button"
            onClick={() => onMarkRead?.(_id)}
            className="rounded-md p-2 text-secondary transition hover:bg-gray-100 hover:text-tertiary"
            aria-label="Mark as read"
            title="Mark as read"
          >
            <Check size={16} />
          </button>
        )}

        <button
          type="button"
          onClick={() => onDelete?.(_id)}
          className="rounded-md p-2 text-secondary transition hover:bg-gray-100 hover:text-red-600"
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
