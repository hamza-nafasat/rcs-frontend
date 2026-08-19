import Button from "../../../components/shared/Button";

const NotificationHeading = ({
  heading,
  subheading,
  unreadCount = 0,
  onMarkAllRead,
}) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="heading-lg text-tertiary">{heading}</h1>
        <p className=" text-muted">{subheading}</p>
      </div>

      <Button
        onClick={onMarkAllRead}
        disabled={unreadCount === 0}
        className="px-4! py-2.5! disabled:cursor-not-allowed disabled:opacity-50"
      >
        Mark all as read
      </Button>
    </div>
  );
};

export default NotificationHeading;
