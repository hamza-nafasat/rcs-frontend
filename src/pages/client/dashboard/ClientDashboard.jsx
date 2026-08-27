import StatsCard from "../../admin/dashboard/components/StatsCard";
import DashboardHeading from "./components/DashboardHeading";
import TotalUsersIcon from "../../../assets/SVGs/TotalUsersIcon.svg";
import SuccessIcon from "../../../assets/SVGs/SuccessIcon.svg";
import RevenueIcon from "../../../assets/SVGs/RevenueIcon.svg";
import TotalMembersIcon from "../../../assets/SVGs/TotalMembersIcon.svg";

const cardData = [
  {
    icon: TotalUsersIcon,
    value: "12",
    label: "Total Applicants",
    comparison: "All time",
  },
  {
    icon: SuccessIcon,
    value: "28",
    label: "Approved",
    comparison: "0% of total",
  },
  {
    icon: RevenueIcon,
    value: "4",
    label: "Conditional",
    comparison: "Needs review",
  },
  {
    icon: TotalMembersIcon,
    value: "82",
    label: "Avg Score",
    comparison: "/ 100 possible",
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
