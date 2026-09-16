import DashboardHeading from "../../../components/global/DashboardHeading";
import DashboardStatsCard from "./components/DashboardStatsCard";

import Card from "../../../components/shared/Card";
import DashboardLineChart from "./components/DashboardLineChart";
import DashboardLeadsPerClient from "./components/DashboardLeadsPerClient";
import DashboardBarChart from "./components/DashboardBarChart";
import DashboardMultiLineChart from "./components/DashboardMultiLineChart";
import DashboardRecentActivity from "./components/DashboardRecentActivity";
import DashboardClientsNeedingAttention from "./components/DashboardClientsNeedingAttention";
import { activities } from "./utils/data";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../../../routes/useAuthUser";
import { clients, leadsPerClient, cardData } from "./utils/data";

const AdminDashboard = () => {
  const navigate = useNavigate();
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
          <div
            key={index}
            className="fade-up h-full"
            style={{ "--fade-delay": `${80 + index * 70}ms` }}
          >
            <DashboardStatsCard {...card} />
          </div>
        ))}
      </section>

      {/* Revenue & Clients */}
      <section
        className="fade-up grid grid-cols-1 items-stretch gap-4 lg:grid-cols-5"
        style={{ "--fade-delay": "360ms" }}
      >
        <Card className="flex h-full flex-col lg:col-span-3">
          <DashboardHeading
            heading="Clients trend"
            subheading="Monthly incoming clients over time"
          />

          <DashboardLineChart
            labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
            data={[20, 35, 28, 50, 45, 70]}
          />
        </Card>

        <Card className="flex h-full min-h-0 flex-col lg:col-span-2">
          <DashboardLeadsPerClient
            clients={leadsPerClient}
            subheading="23 active Clients"
            onViewAll={() => navigate("/admin/dashboard/clients")}
          />
        </Card>
      </section>

      {/* Bar & Multi Line */}
      <section
        className="fade-up grid grid-cols-1 gap-4 lg:grid-cols-2"
        style={{ "--fade-delay": "440ms" }}
      >
        <Card
          className="flex flex-col"
          header={
            <DashboardHeading
              heading="Leads Comparison"
              subheading="Comparison of leads"
            />
          }
        >
          <DashboardBarChart
            labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
            data={[20, 35, 28, 50, 45, 70]}
          />
        </Card>

        <Card
          className="flex flex-col"
          header={
            <DashboardHeading
              heading="Leads approval vs Rejection"
              subheading="6-month approval vs Rejection report"
            />
          }
        >
          <DashboardMultiLineChart
            labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
            datasets={[
              {
                label: "Clients",
                data: [20, 35, 30, 50, 45, 65],
                borderColor: "#F97316",
                backgroundColor: "transparent",
                tension: 0.4,
              },
              {
                label: "Leads",
                data: [15, 25, 40, 35, 55, 60],
                borderColor: "#2563EB",
                backgroundColor: "transparent",
                tension: 0.4,
              },
            ]}
          />
        </Card>
      </section>

      {/* Activity & Attention */}
      <section
        className="fade-up grid grid-cols-1 items-start gap-4 lg:grid-cols-2"
        style={{ "--fade-delay": "520ms" }}
      >
        <Card className="flex flex-col">
          <DashboardRecentActivity
            activities={activities}
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
