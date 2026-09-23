import NotificationItem from "./NotificationItem";

const NotificationList = ({ notifications, emptyText = "No notifications yet", onMarkRead, onDelete }) => {
  if (notifications.length === 0) {
    return (
      <section className="rounded-2xl border color-border bg-white p-10 text-center">
        <p className="text-sm text-muted">{emptyText}</p>
      </section>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification._id}
          notification={notification}
          onMarkRead={onMarkRead}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default NotificationList;
