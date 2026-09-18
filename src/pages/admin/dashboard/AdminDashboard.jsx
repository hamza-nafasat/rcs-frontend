import { useMemo } from "react";
import DashboardHeading from "../../../components/global/DashboardHeading";
import DashboardStatsCard from "../../../components/global/DashboardStatsCard";

import Card from "../../../components/shared/Card";
import DashboardBarChart from "../../../components/global/DashboardBarChart";
import DashboardRecentSupports from "./components/DashboardRecentSupports";
import DashboardMultiLineChart from "./components/DashboardMultiLineChart";
import DashboardRecentActivity from "./components/DashboardRecentActivity";
import { statCards } from "./utils/data";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../../../routes/useAuthUser";
import DashboardDonutChart from "../../../components/global/DashboardDonutChart";
import { useGetAllActivitiesQuery } from "../../../store/apis/admin/activity.apis";
import { useGetAllSupportsQuery } from "../../../store/apis/shared/support.apis";
import { useGetDashboardStatsQuery } from "../../../store/apis/admin/dashboard.apis";
import { buildOutcome, dashboardSubheading, formatChange } from "../../../utils/dashboardStats";

// the api numbers as chart props
const buildCharts = (stats) => {
  const series = stats?.series ?? {};

  return {
    months: stats?.months ?? [],
    clientsVsLeads: [
      { label: "Clients", data: series.clients ?? [], backgroundColor: "#F97316" },
      { label: "Leads", data: series.pipelines ?? [], backgroundColor: "#2563EB" },
    ],
    fddVsSupports: [
      { label: "FDDs", data: series.fdds ?? [], borderColor: "#22C55E", backgroundColor: "transparent", tension: 0.4 },
      {
        label: "Supports",
        data: series.supports ?? [],
        borderColor: "#F97316",
        backgroundColor: "transparent",
        tension: 0.4,
      },
    ],
    leadsOutcome: buildOutcome(stats?.pipelineStages),
  };
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data: activityData } = useGetAllActivitiesQuery({ limit: 5 }, { refetchOnMountOrArgChange: true });
  const { data: supportData, isFetching: isLoadingSupports } = useGetAllSupportsQuery(
    { limit: 5 },
    { refetchOnMountOrArgChange: true },
  );
  const { user } = useAuthUser();
  const { data: dashboardData } = useGetDashboardStatsQuery(undefined, { refetchOnMountOrArgChange: true });

  // stable props keep charts steady
  const stats = dashboardData?.data;
  const charts = useMemo(() => buildCharts(stats), [stats]);

  return (
    <article className="flex flex-col gap-4">
      {/* Page Heading */}
      <DashboardHeading
        className="fade-up"
        emoji="👋"
        heading={user?.firstName ? `Good morning, ${user.firstName}` : "Good morning"}
        subheading={dashboardSubheading(stats)}
      />

      {/* Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ metric, ...card }, index) => {
          const figure = stats?.totals?.[metric];

          return (
            <div key={metric} className="fade-up h-full" style={{ "--fade-delay": `${80 + index * 70}ms` }}>
              <DashboardStatsCard
                {...card}
                value={figure ? figure.total.toLocaleString() : "—"}
                comparison={figure ? formatChange(figure.change) : ""}
              />
            </div>
          );
        })}
      </section>

      {/* Outcome & Comparison */}
      <section className="fade-up grid grid-cols-1 gap-4 lg:grid-cols-5" style={{ "--fade-delay": "440ms" }}>
        <Card
          className="flex flex-col lg:col-span-3"
          header={<DashboardHeading heading="Clients vs Leads" subheading="Monthly clients against leads" />}
        >
          <DashboardBarChart labels={charts.months} datasets={charts.clientsVsLeads} />
        </Card>
        <Card
          className="flex flex-col lg:col-span-2"
          header={<DashboardHeading heading="Leads Outcome" subheading="Applications by outcome" />}
        >
          <DashboardDonutChart {...charts.leadsOutcome} />
        </Card>
      </section>

      {/* Documents & Supports */}
      <section
        className="fade-up grid grid-cols-1 items-stretch gap-4 lg:grid-cols-5"
        style={{ "--fade-delay": "360ms" }}
      >
        <Card className="flex h-full min-h-0 flex-col lg:col-span-2">
          <DashboardRecentSupports
            tickets={supportData?.data ?? []}
            isLoading={isLoadingSupports}
            onViewAll={() => navigate("/admin/dashboard/support")}
          />
        </Card>
        <Card className="flex h-full flex-col lg:col-span-3">
          <DashboardHeading heading="FDD vs Supports" subheading="Monthly documents against tickets" />

          <DashboardMultiLineChart labels={charts.months} datasets={charts.fddVsSupports} />
        </Card>
      </section>

      {/* Recent activity */}
      <section className="fade-up" style={{ "--fade-delay": "520ms" }}>
        <Card className="flex flex-col">
          <DashboardRecentActivity
            activities={activityData?.data ?? []}
            onAction={() => navigate("/admin/dashboard/view-all-activity")}
          />
        </Card>
      </section>
    </article>
  );
};
export default AdminDashboard;
