import StatsCard from "../../admin/dashboard/components/StatsCard";
import DashboardHeading from "./components/DashboardHeading";
import TotalUsersIcon from "../../../assets/SVGs/TotalUsersIcon.svg";
import SuccessIcon from "../../../assets/SVGs/SuccessIcon.svg";
import RevenueIcon from "../../../assets/SVGs/RevenueIcon.svg";
import TotalMembersIcon from "../../../assets/SVGs/TotalMembersIcon.svg";

const cardData = [
  {
    icon: TotalUsersIcon,
    badge: "+3",
    value: "12",
    label: "Active Leads",
    comparison: "↑ 12% vs last month",
  },
  {
    icon: SuccessIcon,
    badge: "+5",
    value: "28",
    label: "Messages",
    comparison: "↑ 8% vs last month",
  },
  {
    icon: RevenueIcon,
    badge: "+2",
    value: "4",
    label: "Applications",
    comparison: "↑ 15% vs last month",
  },
  {
    icon: TotalMembersIcon,
    badge: "+6",
    value: "82",
    label: "Pipeline Score",
    comparison: "↑ 6% vs last month",
  },
];

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
            <StatsCard {...card} />
          </div>
        ))}
      </section>
    </article>
  );
};

export default ClientDashboard;
