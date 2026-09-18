import { Clock } from "lucide-react";
import { formatRelativeTime } from "../../../utils/formatTime";
import { actionOf, ACTIVITY_MODULES, exactTime } from "../../../utils/activityLog";

const ActivityTimeline = ({
  activities = [],
  showDetails = false,
  emptyText = "No activity in the last 5 days",
  className = "",
}) => {
  if (activities.length === 0)
    return <p className={`py-8 text-center text-sm text-secondary ${className}`}>{emptyText}</p>;

  return (
    <ol className={className}>
      {activities.map((activity, index) => {
        const { label, icon: Icon, color, bg } = actionOf(activity?.action);
        const isLast = index === activities.length - 1;

        return (
          <li key={activity._id} className="relative flex gap-3">
            {/* Timeline */}
            <div className="relative flex w-8 shrink-0 justify-center">
              <span
                className="z-10 flex size-8 items-center justify-center rounded-full"
                style={{ backgroundColor: bg }}
              >
                <Icon size={14} style={{ color }} />
              </span>
              {!isLast && (
                <span className="absolute top-9 bottom-0 left-1/2 w-px -translate-x-1/2 bg-(--color-border)" />
              )}
            </div>

            <div className="min-w-0 flex-1 pb-6">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <p className="min-w-0 text-sm leading-5 text-tertiary">
                  <span className="font-semibold">{activity?.actorName ?? "Someone"}</span>{" "}
                  <span className="font-medium" style={{ color }}>
                    {label.toLowerCase()}
                  </span>{" "}
                  {activity?.summary}
                </p>

                <span
                  title={exactTime(activity?.createdAt)}
                  className="flex shrink-0 items-center gap-1 text-xs text-muted"
                >
                  <Clock size={12} />
                  {formatRelativeTime(activity?.createdAt)}
                </span>
              </div>

              <span className="mt-1.5 inline-block rounded-full bg-active px-2 py-0.5 text-[11px] font-medium text-secondary">
                {ACTIVITY_MODULES[activity?.module] ?? activity?.module}
              </span>

              {/* what exactly changed */}
              {showDetails && activity?.changes?.length > 0 && (
                <ul className="mt-2 flex flex-col gap-1 rounded-xl bg-muted p-3 text-xs text-secondary">
                  {activity.changes.map((change) => (
                    <li key={change.field}>
                      <span className="font-medium text-tertiary">{change.field}:</span> {change.from ?? "—"} →{" "}
                      {change.to ?? "—"}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default ActivityTimeline;
