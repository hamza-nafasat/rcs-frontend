import { useState } from "react";
import Card from "../../../components/shared/Card";
import ActivityTimeline from "../../../components/global/activity/ActivityTimeline";
import ViewAllActivityHeading from "./components/ViewAllActivityHeading";
import ViewAllActivityFilter from "./components/ViewAllActivityFilter";
import { ACTIVITY_RETENTION_DAYS, dayLabel } from "../../../utils/activityLog";
import { useGetAllActivitiesQuery } from "../../../store/apis/admin/activity.apis";

const initialFilters = { moderator: [], action: [], module: [] };

// nothing picked matches everything
const matches = (picked, value) => picked.length === 0 || picked.includes(value);

// one group per day, newest first
const groupByDay = (activities) =>
  activities.reduce((days, activity) => {
    const day = dayLabel(activity?.createdAt);
    const last = days[days.length - 1];
    if (last?.day === day) last.items.push(activity);
    else days.push({ day, items: [activity] });
    return days;
  }, []);

const ViewAllActivity = () => {
  const [filters, setFilters] = useState(initialFilters);

  // always the latest on open
  const { data, isFetching } = useGetAllActivitiesQuery(undefined, { refetchOnMountOrArgChange: true });
  const activities = data?.data ?? [];

  const moderators = [...new Map(activities.map((activity) => [activity?.actor, activity?.actorName])).entries()].map(
    ([value, label]) => ({ value, label }),
  );

  const filteredActivities = activities.filter(
    (activity) =>
      matches(filters.moderator, activity?.actor) &&
      matches(filters.action, activity?.action) &&
      matches(filters.module, activity?.module),
  );

  const days = groupByDay(filteredActivities);

  return (
    <article className="flex flex-col gap-6">
      <ViewAllActivityHeading
        heading="All Activity"
        subheading={`Everything your moderators did in the last ${ACTIVITY_RETENTION_DAYS} days`}
      />

      <ViewAllActivityFilter filters={filters} setFilters={setFilters} moderators={moderators} />

      <Card>
        {days.length === 0 ? (
          <ActivityTimeline
            activities={[]}
            emptyText={isFetching ? "Loading activity…" : "No activity matches these filters"}
          />
        ) : (
          days.map(({ day, items }) => (
            <section key={day} className="mb-2 last:mb-0">
              <h2 className="mb-3 text-xs font-semibold tracking-wide text-secondary uppercase">{day}</h2>
              <ActivityTimeline activities={items} showDetails />
            </section>
          ))
        )}
      </Card>
    </article>
  );
};

export default ViewAllActivity;
