import DashboardHeading from "./components/DashboardHeading";
import StatsCard from "./components/StatsCard";
import TotalUsersIcon from "../../../assets/SVGs/TotalUsersIcon.svg";
import SuccessIcon from "../../../assets/SVGs/SuccessIcon.svg";
import RevenueIcon from "../../../assets/SVGs/RevenueIcon.svg";
import TotalMembersIcon from "../../../assets/SVGs/TotalMembersIcon.svg";
import Card from "../../../components/shared/Card";
import LineChart from "./components/LineChart";
import LeadsPerClient from "./components/LeadsPerClient";
import BarChart from "./components/BarChart";
import MultiLineChart from "./components/MultiLineChart";
import RecentActivity from "./components/RecentActivity";
import ClientsNeedingAttention from "./components/ClientsNeedingAttention";
import { activities } from "./data/activityData";
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

const leadsPerClient = [
  {
    id: 1,
    name: "Coastal Bistro",
    owner: "Ahmed Sarfaz",
    leads: 7,
    status: "Active",
  },
  {
    id: 2,
    name: "Spice Route",
    owner: "Priya Patel",
    leads: 5,
    status: "Needs Attention",
  },
  {
    id: 3,
    name: "The Rustic Table",
    owner: "Marcus Williams",
    leads: 4,
    status: "Needs Attention",
  },
  {
    id: 4,
    name: "Urban Greens",
    owner: "Sofia Chen",
    leads: 3,
    status: "Active",
  },
  {
    id: 5,
    name: "Golden Harvest",
    owner: "James Liu",
    leads: 4,
    status: "Active",
  },
  {
    id: 6,
    name: "Harbour Grill",
    owner: "Elena Rossi",
    leads: 4,
    status: "Needs Attention",
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
        className="fade-up"
        emoji="👋"
        heading="Good morning, Marco"
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
            <StatsCard {...card} />
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

          <LineChart
            labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
            data={[20, 35, 28, 50, 45, 70]}
          />
        </Card>

        <Card className="flex h-full min-h-0 flex-col lg:col-span-2">
          <LeadsPerClient
            clients={leadsPerClient}
            subheading="23 active Clients"
            onViewAll={() => navigate("/dashboard/clients")}
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
          <BarChart
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
      <section
        className="fade-up grid grid-cols-1 items-start gap-4 lg:grid-cols-2"
        style={{ "--fade-delay": "520ms" }}
      >
        <Card className="flex flex-col">
          <RecentActivity
            activities={activities}
            maxItems={7}
            onAction={() => navigate("/dashboard/view-all-activity")}
          />
        </Card>

        <Card className="flex flex-col">
          <ClientsNeedingAttention clients={clients} />
        </Card>
      </section>
    </article>
  );
};
export default AdminDashboard;
