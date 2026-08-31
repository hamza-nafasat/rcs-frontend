import StatsCard from "../../admin/dashboard/components/StatsCard";
import DashboardHeading from "./components/DashboardHeading";
import TotalUsersIcon from "../../../assets/SVGs/TotalUsersIcon.svg";
import ClientApprovedIcon from "../../../assets/SVGs/ClientApprovedIcon.svg";
import ClientConditionalIcon from "../../../assets/SVGs/ClientConditionalIcon.svg";
import ClientAvgScoreIcon from "../../../assets/SVGs/ClientAvgScoreIcon.svg";
import DonutChart from "./components/DonutChart";
import BarChart from "./components/BarChart";
import Card from "../../../components/shared/Card";
import ApplicantsScored from "./components/ApplicantsScored";
import RecentApplicants from "./components/RecentApplicants";

const cardData = [
  {
    icon: TotalUsersIcon,
    value: "12",
    label: "Total Applicants",
    comparison: "All time",
  },
  {
    icon: ClientApprovedIcon,
    value: "28",
    label: "Approved",
    comparison: "0% of total",
  },
  {
    icon: ClientConditionalIcon,
    value: "4",
    label: "Conditional",
    comparison: "Needs review",
  },
  {
    icon: ClientAvgScoreIcon,
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

      <section
        className="fade-up grid grid-cols-1 items-stretch gap-4 lg:grid-cols-5"
        style={{ "--fade-delay": "440ms" }}
      >
        <Card
          className="h-full lg:col-span-3"
          header={<DashboardHeading heading="Clients per month" />}
        >
          <BarChart
            labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
            data={[2, 3, 2, 5, 4, 7]}
          />
        </Card>

        <Card className="h-full lg:col-span-2">
          <DashboardHeading heading="Pipeline by Stage" />

          <DonutChart
            labels={["Approved", "Denied", "Pending"]}
            data={[25, 20, 15]}
            colors={["#EAB308", "#DC2626", "#047857"]}
          />
        </Card>
      </section>

      <section className="fade-up" style={{ "--fade-delay": "520ms" }}>
        <ApplicantsScored />
      </section>

      <section className="fade-up" style={{ "--fade-delay": "600ms" }}>
        <RecentApplicants />
      </section>
    </article>
  );
};

export default ClientDashboard;
