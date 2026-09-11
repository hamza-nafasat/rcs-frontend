import PipelineHeading from "../../../components/global/PipelineHeading";
import PipelineStageOverview from "./components/PipelineStageOverview";
import PipelineTable from "./components/PipelineTable";
import { initialApplicants } from "./utils/data";
import PipelineFilter from "./components/PipelineFilter";
import { useState } from "react";

const initialFilters = {
  applicant: "",
  franchise: "",
  stage: [],
  territory: [],
};

const AdminPipeline = () => {
  const [filters, setFilters] = useState(initialFilters);

  // these lists will come from the backend later
  const stages = [...new Set(initialApplicants.map((row) => row.stage))];
  const territories = [
    ...new Set(initialApplicants.map((row) => row.territory)),
  ];

  return (
    <article className="flex flex-col gap-4">
      <PipelineHeading
        heading="Franchise Pipeline"
        subheading="Applicant qualification scorecard — automated scoring engine"
      />

      {/* Filters */}
      <PipelineFilter
        filters={filters}
        setFilters={setFilters}
        stages={stages}
        territories={territories}
      />

      {/* Stage overview */}
      <PipelineStageOverview />

      {/* Applicants */}
      <PipelineTable filters={filters} />
    </article>
  );
};

export default AdminPipeline;
