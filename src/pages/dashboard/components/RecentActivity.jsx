const RecentActivity = ({
  activities = [],
  title = "Recent Activity",
  actionLabel = "View all",
  onAction,
}) => {
  return (
    <div>
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>

        {actionLabel && (
          <button
            type="button"
            onClick={onAction}
            className="text-sm font-medium text-orange-500"
          >
            {actionLabel}
          </button>
        )}
      </div>

      {/* Activities */}
      <div>
        {activities.map((activity, index) => (
          <div key={activity.id ?? index} className="flex gap-3">
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
