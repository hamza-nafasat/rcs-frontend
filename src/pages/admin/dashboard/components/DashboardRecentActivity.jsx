import Button from "../../../../components/shared/Button";

const DashboardRecentActivity = ({
  activities = [],
  title = "Recent Activity",
  actionLabel = "View all",
  onAction,
  maxItems,
}) => {
  const visibleActivities =
    typeof maxItems === "number" ? activities.slice(0, maxItems) : activities;

  return (
    <>
      {/* Header */}
      <section className="mb-5 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>

        {actionLabel && (
          <Button
            variant="bare"
            className="text-sm font-medium text-orange-500"
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        )}
      </section>

      {/* Activities */}
      <section>
        {visibleActivities.map((activity, index) => (
          <section
            key={activity.id ?? index}
            className="relative flex flex-row items-stretch gap-3"
          >
            {/* Timeline */}
            <div className="relative flex w-5 shrink-0 justify-center">
              <span className="relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />
              {index !== visibleActivities.length - 1 && (
                <span className="absolute left-1/2 top-4 bottom-0 w-px -translate-x-1/2 bg-gray-200" />
              )}
            </div>

            {/* Content */}
            <div className="flex min-w-0 flex-1 flex-col gap-1 pb-6 sm:flex-row sm:justify-between sm:gap-4">
              <p className="min-w-0 text-sm leading-5 text-gray-900 sm:max-w-[70%]">
                {activity.text}
              </p>

              <span className="flex shrink-0 items-start gap-1 text-xs text-gray-500 sm:justify-end">
                <span>◷</span>
                {activity.time}
              </span>
            </div>
          </section>
        ))}
      </section>
    </>
  );
};

export default DashboardRecentActivity;
