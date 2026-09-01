import FranchisePipelineHeading from "./components/FranchisePipelineHeading";
import PipelineStageOverview from "./components/PipelineStageOverview";
import FranchisePipelineTable from "./components/FranchisePipelineTable";
import { initialApplicants } from "./components/pipelineApplicants";
import FranchisePipelineFilter from "./components/FranchisePipelineFilter";
import { useState } from "react";

const initialFilters = {
  applicant: "",
  franchise: "",
  stage: [],
  territory: [],
};

const Pipeline = () => {
  const [filters, setFilters] = useState(initialFilters);

  // these lists will come from the backend later
  const stages = [...new Set(initialApplicants.map((row) => row.stage))];
  const territories = [
    ...new Set(initialApplicants.map((row) => row.territory)),
  ];

  return (
    <article className="flex flex-col gap-4">
      <FranchisePipelineHeading
        heading="Franchise Pipeline"
        subheading="Applicant qualification scorecard — automated scoring engine"
      />

      {/* Filters */}
      <FranchisePipelineFilter
        filters={filters}
        setFilters={setFilters}
        stages={stages}
        territories={territories}
      />

      {/* Stage overview */}
      <PipelineStageOverview />

      {/* Applicants */}
      <FranchisePipelineTable filters={filters} />
    </article>
  );
};

export default Pipeline;
