import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../../components/shared/Card";
import DashboardHeading from "../../../components/global/DashboardHeading";
import DashboardStatsCard from "../../../components/global/DashboardStatsCard";
import DashboardBarChart from "../../../components/global/DashboardBarChart";
import DashboardDonutChart from "../../../components/global/DashboardDonutChart";
import PipelineTable from "../../../components/global/pipeline/PipelineTable";
import DashboardApplicantsScored from "./components/DashboardApplicantsScored";
import { useAuthUser } from "../../../routes/useAuthUser";
import { useGetAllPipelinesQuery } from "../../../store/apis/shared/pipeline.apis";
import { useGetClientDashboardStatsQuery } from "../../../store/apis/client/dashboard.apis";
import { buildOutcome, dashboardSubheading, formatChange } from "../../../utils/dashboardStats";
import { statCards } from "./utils/data";

// the api numbers as chart props
const buildCharts = (stats) => ({
  months: stats?.months ?? [],
  franchisees: [{ label: "Franchisee", data: stats?.series?.franchisees ?? [], backgroundColor: "#F97316" }],
  outcome: buildOutcome(stats?.pipelineStages),
});

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthUser();
  const { data: pipelineData, isFetching } = useGetAllPipelinesQuery(
    { limit: 5 },
    { refetchOnMountOrArgChange: true },
  );
  const { data: dashboardData } = useGetClientDashboardStatsQuery(undefined, { refetchOnMountOrArgChange: true });

  // stable props keep charts steady
  const stats = dashboardData?.data;
  const charts = useMemo(() => buildCharts(stats), [stats]);

  return (
    <article className="flex flex-col gap-4">
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

      {/* Franchisee & Pipeline */}
      <section
        className="fade-up grid grid-cols-1 items-stretch gap-4 lg:grid-cols-5"
        style={{ "--fade-delay": "440ms" }}
      >
        <Card className="h-full lg:col-span-3" header={<DashboardHeading heading="Franchisee per month" />}>
          <DashboardBarChart labels={charts.months} datasets={charts.franchisees} />
        </Card>

        <Card className="h-full lg:col-span-2">
          <DashboardHeading heading="Pipeline by Stage" />
          <DashboardDonutChart {...charts.outcome} />
        </Card>
      </section>

      <section className="fade-up" style={{ "--fade-delay": "520ms" }}>
        <DashboardApplicantsScored />
      </section>

      {/* Recent applicants */}
      <section className="fade-up" style={{ "--fade-delay": "600ms" }}>
        <PipelineTable
          heading="Recent Applicants"
          applications={pipelineData?.data ?? []}
          isLoading={isFetching}
          onRowClick={(row) => navigate(`/client/dashboard/pipeline/${row?._id}`)}
        />
      </section>
    </article>
  );
};

export default ClientDashboard;
