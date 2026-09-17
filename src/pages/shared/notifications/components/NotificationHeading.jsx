import Button from "../../../../components/shared/Button";

const NotificationHeading = ({
  heading,
  subheading,
  unreadCount = 0,
  isLoading = false,
  onMarkAllRead,
}) => {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
      <div>
        <h1 className="heading-lg text-tertiary">{heading}</h1>
        <p className=" text-muted">{subheading}</p>
      </div>

      <Button
        onClick={onMarkAllRead}
        isLoading={isLoading}
        isDisabled={unreadCount === 0}
        className="shrink-0 text-sm whitespace-nowrap px-3! py-2! sm:px-4! sm:py-2.5! sm:text-base w-full sm:w-auto"
      >
        Mark all as read
      </Button>
    </header>
  );
};

export default NotificationHeading;
