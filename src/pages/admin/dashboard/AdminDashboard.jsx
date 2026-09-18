import DashboardHeading from "../../../components/global/DashboardHeading";
import DashboardStatsCard from "./components/DashboardStatsCard";

import Card from "../../../components/shared/Card";
import DashboardBarChart from "./components/DashboardBarChart";
import DashboardRecentSupports from "./components/DashboardRecentSupports";
import DashboardMultiLineChart from "./components/DashboardMultiLineChart";
import DashboardRecentActivity from "./components/DashboardRecentActivity";
import DashboardClientsNeedingAttention from "./components/DashboardClientsNeedingAttention";
import {
  cardData,
  chartMonths,
  clients,
  clientsVsLeads,
  fddVsSupports,
  leadsOutcome,
  recentSupports,
} from "./utils/data";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../../../routes/useAuthUser";
import DashboardDonutChart from "../../../components/global/DashboardDonutChart";
import { useGetAllActivitiesQuery } from "../../../store/apis/admin/activity.apis";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data: activityData } = useGetAllActivitiesQuery({ limit: 7 }, { refetchOnMountOrArgChange: true });
  const { user } = useAuthUser();

  return (
    <article className="flex flex-col gap-4">
      {/* Page Heading */}
      <DashboardHeading
        className="fade-up"
        emoji="👋"
        heading={user?.firstName ? `Good morning, ${user.firstName}` : "Good morning"}
        subheading="Monday, August 3, 2026 · You had 0 leads yesterday and 8 messages awaiting response."
      />

      {/* Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cardData.map((card, index) => (
          <div key={index} className="fade-up h-full" style={{ "--fade-delay": `${80 + index * 70}ms` }}>
            <DashboardStatsCard {...card} />
          </div>
        ))}
      </section>

      {/* Outcome & Comparison */}
      <section className="fade-up grid grid-cols-1 gap-4 lg:grid-cols-5" style={{ "--fade-delay": "440ms" }}>
        <Card
          className="flex flex-col lg:col-span-3"
          header={<DashboardHeading heading="Clients vs Leads" subheading="Monthly clients against leads" />}
        >
          <DashboardBarChart labels={chartMonths} datasets={clientsVsLeads} />
        </Card>
        <Card
          className="flex flex-col lg:col-span-2"
          header={<DashboardHeading heading="Leads approved vs Denied" subheading="Applications by outcome" />}
        >
          <DashboardDonutChart {...leadsOutcome} />
        </Card>
      </section>

      {/* Documents & Supports */}
      <section
        className="fade-up grid grid-cols-1 items-stretch gap-4 lg:grid-cols-5"
        style={{ "--fade-delay": "360ms" }}
      >
        <Card className="flex h-full min-h-0 flex-col lg:col-span-2">
          <DashboardRecentSupports tickets={recentSupports} onViewAll={() => navigate("/admin/dashboard/support")} />
        </Card>
        <Card className="flex h-full flex-col lg:col-span-3">
          <DashboardHeading heading="FDD vs Supports" subheading="Monthly documents against tickets" />

          <DashboardMultiLineChart labels={chartMonths} datasets={fddVsSupports} />
        </Card>
      </section>

      {/* Activity & Attention */}
      <section
        className="fade-up grid grid-cols-1 items-start gap-4 lg:grid-cols-2"
        style={{ "--fade-delay": "520ms" }}
      >
        <Card className="flex flex-col">
          <DashboardRecentActivity
            activities={activityData?.data ?? []}
            maxItems={7}
            onAction={() => navigate("/admin/dashboard/view-all-activity")}
          />
        </Card>

        <Card className="flex flex-col">
          <DashboardClientsNeedingAttention clients={clients} />
        </Card>
      </section>
    </article>
  );
};
export default AdminDashboard;
