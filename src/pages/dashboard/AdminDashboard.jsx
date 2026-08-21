import DashboardHeading from "./components/DashboardHeading";
import StatsCard from "./components/StatsCard";
import TotalUsersIcon from "../../assets/SVGs/TotalUsersIcon.svg";
import SuccessIcon from "../../assets/SVGs/SuccessIcon.svg";
import RevenueIcon from "../../assets/SVGs/RevenueIcon.svg";
import TotalMembersIcon from "../../assets/SVGs/TotalMembersIcon.svg";
import Card from "../../components/shared/Card";
import LineChart from "./components/LineChart";
import DonutChart from "./components/DonutChart";
import BarChart from "./components/BarChart";
import MultiLineChart from "./components/MultiLineChart";
import RecentActivity from "./components/RecentActivity";
import ClientsNeedingAttention from "./components/ClientsNeedingAttention";
import { activities } from "./activityData";
import { useNavigate } from "react-router-dom";

const clients = [
  {
    id: 1,
    initials: "SR",
    name: "Spice Route",
    personName: "Priya Patel",
    progress: 61,
    progressColor: "#EF4444",
  },
  {
    id: 2,
    initials: "RT",
    name: "The Rustic Table",
    personName: "Marcus Williams",
    progress: 70,
    progressColor: "#FBBF24",
  },
  {
    id: 1,
    initials: "SR",
    name: "Spice Route",
    personName: "Priya Patel",
    progress: 61,
    progressColor: "#EF4444",
  },
  {
    id: 2,
    initials: "RT",
    name: "The Rustic Table",
    personName: "Marcus Williams",
    progress: 70,
    progressColor: "#FBBF24",
  },
  {
    id: 1,
    initials: "SR",
    name: "Spice Route",
    personName: "Priya Patel",
    progress: 61,
    progressColor: "#EF4444",
  },
  {
    id: 2,
    initials: "RT",
    name: "The Rustic Table",
    personName: "Marcus Williams",
    progress: 70,
    progressColor: "#FBBF24",
  },
  {
    id: 1,
    initials: "SR",
    name: "Spice Route",
    personName: "Priya Patel",
    progress: 61,
    progressColor: "#EF4444",
  },
  {
    id: 2,
    initials: "RT",
    name: "The Rustic Table",
    personName: "Marcus Williams",
    progress: 70,
    progressColor: "#FBBF24",
  },
  {
    id: 1,
    initials: "SR",
    name: "Spice Route",
    personName: "Priya Patel",
    progress: 61,
    progressColor: "#EF4444",
  },
  {
    id: 2,
    initials: "RT",
    name: "The Rustic Table",
    personName: "Marcus Williams",
    progress: 70,
    progressColor: "#FBBF24",
  },
];

const cardData = [
  {
    icon: TotalUsersIcon,
    badge: "+3",
    value: "1,245",
    label: "Total Clients",
    comparison: "↑ 12% vs last month",
  },
  {
    icon: SuccessIcon,
    badge: "+5",
    value: "2,345",
    label: "Total Messages",
    comparison: "↑ 8% vs last month",
  },
  {
    icon: RevenueIcon,
    badge: "+2",
    value: "567",
    label: "Total Leads",
    comparison: "↑ 15% vs last month",
  },
  {
    icon: TotalMembersIcon,
    badge: "+72",
    value: "567",
    label: "Total Leads",
    comparison: "↑ 15% vs last month",
  },
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <article className="flex flex-col gap-4">
      {/* Page Heading */}
      <DashboardHeading
        emoji="👋"
        heading="Good morning, marrrram"
        subheading="Monday, August 3, 2026 · You had 0 leads yesterday and 8 messages awaiting response."
      />

      {/* Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cardData.map((card, index) => (
          <StatsCard key={index} {...card} />
        ))}
      </section>

      {/* Revenue & Clients */}
      <section className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-5">
        <Card className="h-full lg:col-span-3 ">
          <DashboardHeading
            heading="Revenue"
            subheading="Compared with last month"
          />

          <LineChart
            labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
            data={[20, 35, 28, 50, 45, 70]}
          />
        </Card>

        <Card className="h-full lg:col-span-2">
          <DashboardHeading
            heading="Client Overview"
            subheading="Current client distribution"
          />

          <DonutChart
            labels={[
              "Clients",
              "Leads",
              "Pending",
              "Active",
              "Inactive",
              "Completed",
              "Cancelled",
            ]}
            data={[25, 20, 15, 12, 10, 10, 8]}
            colors={[
              "#6366F1",
              "#22C55E",
              "#EF4444",
              "#F59E0B",
              "#06B6D4",
              "#8B5CF6",
              "#F97316",
            ]}
          />
        </Card>
      </section>

      {/* Bar & Multi Line */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card
          header={
            <DashboardHeading
              heading="Revenue"
              subheading="Compared with last month"
            />
          }
        >
          <BarChart
            labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
            data={[20, 35, 28, 50, 45, 70]}
          />
        </Card>

        <Card
          header={
            <DashboardHeading
              heading="Performance"
              subheading="Clients vs leads"
            />
          }
        >
          <MultiLineChart
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
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="flex h-full flex-col">
          <RecentActivity
            activities={activities}
            maxItems={8}
            onAction={() => navigate("/dashboard/view-all-activity")}
          />
        </Card>

        <Card className="flex h-full flex-col">
          <ClientsNeedingAttention clients={clients} />
        </Card>
      </section>
    </article>
  );
};
export default AdminDashboard;
