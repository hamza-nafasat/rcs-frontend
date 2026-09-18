import Button from "../../../../components/shared/Button";
import DashboardHeading from "../../../../components/global/DashboardHeading";
import ActivityTimeline from "../../../../components/global/activity/ActivityTimeline";


const DashboardRecentActivity = ({ activities = [], onAction }) => (
  <>
    <header className="mb-5 flex items-start justify-between gap-3">
      <DashboardHeading heading="Recent Activity" subheading="What your moderators did lately" />

      {onAction && (
        <Button variant="bare" onClick={onAction} className="shrink-0 text-sm font-medium text-primary">
          View all
        </Button>
      )}
    </header>

    <ActivityTimeline activities={activities} />
  </>
);

export default DashboardRecentActivity;
