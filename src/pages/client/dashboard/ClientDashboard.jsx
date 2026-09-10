import DashboardStatsCard from "../../admin/dashboard/components/DashboardStatsCard";
import DashboardHeading from "../../../components/global/DashboardHeading";

import DashboardDonutChart from "./components/DashboardDonutChart";
import DashboardBarChart from "./components/DashboardBarChart";
import Card from "../../../components/shared/Card";
import DashboardApplicantsScored from "./components/DashboardApplicantsScored";
import DashboardRecentApplicants from "./components/DashboardRecentApplicants";
import { cardData } from "./utils/data";

const ClientDashboard = () => {
  return (
    <article className="flex flex-col gap-4">
      <DashboardHeading
        className="fade-up"
        emoji="👋"
        heading="Good morning, James"
        subheading="Monday, August 27, 2026 · You had 0 leads yesterday and 8 messages awaiting response."
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cardData.map((card, index) => (
          <div
            key={card.label}
            className="fade-up h-full"
            style={{ "--fade-delay": `${80 + index * 70}ms` }}
          >
            <DashboardStatsCard {...card} />
          </div>
        ))}
      </section>

      <section
        className="fade-up grid grid-cols-1 items-stretch gap-4 lg:grid-cols-5"
        style={{ "--fade-delay": "440ms" }}
      >
        <Card
          className="h-full lg:col-span-3"
          header={<DashboardHeading heading="Clients per month" />}
        >
          <DashboardBarChart
            labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
            data={[2, 3, 2, 5, 4, 7]}
          />
        </Card>

        <Card className="h-full lg:col-span-2">
          <DashboardHeading heading="Pipeline by Stage" />

          <DashboardDonutChart
            labels={["Approved", "Denied", "Pending"]}
            data={[25, 20, 15]}
            colors={["#047857", "#DC2626", "#EAB308"]}
          />
        </Card>
      </section>

      <section className="fade-up" style={{ "--fade-delay": "520ms" }}>
        <DashboardApplicantsScored />
      </section>

      <section className="fade-up" style={{ "--fade-delay": "600ms" }}>
        <DashboardRecentApplicants />
      </section>
    </article>
  );
};

export default ClientDashboard;
