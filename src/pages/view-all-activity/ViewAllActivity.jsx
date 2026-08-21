import Card from "../../components/shared/Card";
import RecentActivity from "../dashboard/components/RecentActivity";
import { activities } from "../dashboard/data/activityData";
import ViewAllActivityHeading from "./components/ViewAllActivityHeading";

const ViewAllActivity = () => {
  return (
    <article className="flex flex-col gap-6">
      <section className="flex flex-wrap items-start justify-between gap-4">
        <ViewAllActivityHeading
          heading="All Activity"
          subheading="Review the latest updates across your account"
        />
      </section>

      <section className="min-h-0 flex-1">
        <Card className="h-full">
          <RecentActivity
            activities={activities}
            title="Activity History"
            actionLabel=""
          />
        </Card>
      </section>
    </article>
  );
};

export default ViewAllActivity;
