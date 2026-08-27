import { useState } from "react";
import PipelineFilter from "./components/PipelineFilter";
import PipelineHeading from "./components/PipelineHeading";
import PipelineTable from "./components/PipelineTable";
import { initialApplicants } from "./data/pipelineApplicants";

const initialFilters = {
  applicant: "",
  franchise: "",
  stage: [],
  territory: [],
};

const Pipeline = () => {
  const [filters, setFilters] = useState(initialFilters);

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

      <PipelineFilter
        filters={filters}
        setFilters={setFilters}
        stages={stages}
        territories={territories}
      />

      <PipelineTable filters={filters} />
    </article>
  );
};

export default Pipeline;
