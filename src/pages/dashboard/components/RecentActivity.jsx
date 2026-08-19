import Button from "../../../components/shared/Button";

const RecentActivity = ({
  activities = [],
  title = "Recent Activity",
  actionLabel = "View all",
  onAction,
}) => {
  return (
    <>
      {/* Header */}
      <section className="mb-5 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>

        {actionLabel && (
          <Button
            type="icon"
            className="text-sm font-medium text-orange-500"
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        )}
      </section>

      {/* Activities */}
      {activities.map((activity, index) => (
        <section
          key={activity.id ?? index}
          className="flex flex-row items-start gap-3"
        >
          {/* Timeline */}
          <div className="flex w-5 flex-col items-center">
            <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />
            {index !== activities.length - 1 && (
              <span className="mt-1 w-px flex-1 bg-gray-200" />
            )}
          </div>

          {/* Content */}
          <div className="flex min-w-0 flex-1 justify-between gap-4 pb-6">
            <p className="max-w-[70%] text-sm leading-5 text-gray-900">
              {activity.text}
            </p>

            <span className="flex shrink-0 items-start gap-1 text-xs text-gray-500">
              <span>◷</span>
              {activity.time}
            </span>
          </div>
        </section>
      ))}
    </>
  );
};

export default RecentActivity;
