import FranchisePipelineHeading from "./components/FranchisePipelineHeading";
import TotalUsersIcon from "../../assets/SVGs/TotalUsersIcon.svg";
import SuccessIcon from "../../assets/SVGs/SuccessIcon.svg";
import RevenueIcon from "../../assets/SVGs/RevenueIcon.svg";
import TotalMembersIcon from "../../assets/SVGs/TotalMembersIcon.svg";
import StatsCard from "./components/StatsCard";
import PipelineStageOverview from "./components/PipelineStageOverview";
import FranchisePipelineTable from "./components/FranchisePipelineTable";
import { ArrowUpRight } from "lucide-react";
const cardData = [
  {
    icon: TotalUsersIcon,
    Badge: ArrowUpRight,
    value: "1,245",
    label: "Total Leads",
  },
  {
    icon: SuccessIcon,
    Badge: ArrowUpRight,
    value: "2,345",
    label: "Approved",
  },
  {
    icon: RevenueIcon,
    Badge: ArrowUpRight,
    value: "567",
    label: "Conditional",
  },
  {
    icon: TotalMembersIcon,
    Badge: ArrowUpRight,
    value: "567",
    label: "Denied",
  },
  {
    icon: RevenueIcon,
    Badge: ArrowUpRight,
    value: "567",
    label: "Avg Score",
  },
];
const FranchisePipeline = () => {
  return (
    <article className="flex flex-col gap-4">
      <FranchisePipelineHeading
        heading="Franchise Pipeline"
        subheading="Applicant qualification scorecard — automated scoring engine"
      />
      {/* Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {cardData.map((card, index) => (
          <StatsCard key={index} {...card} />
        ))}
      </section>

      {/* Stage overview */}
      <PipelineStageOverview />

      {/* Applicants */}
      <FranchisePipelineTable />
    </article>
  );
};

export default FranchisePipeline;
