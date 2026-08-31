import { useState } from "react";
import PipelineFilter from "./components/PipelineFilter";
import PipelineHeading from "./components/PipelineHeading";
import PipelineTable from "./components/PipelineTable";
import ClientPipelineStageOverview from "./components/ClientPipelineStageOverview";
import { initialApplicants } from "./data/pipelineApplicants";

const initialFilters = {
  applicant: "",
  franchise: "",
  stage: [],
  territory: [],
};

const Pipeline = () => {
  const [filters, setFilters] = useState(initialFilters);
  const [applicants, setApplicants] = useState(initialApplicants);

  // these lists will come from the backend later
  const stages = [...new Set(initialApplicants.map((row) => row.stage))];
  const territories = [
    ...new Set(initialApplicants.map((row) => row.territory)),
  ];

  const handleFilterChange = (name, value) => {
    setFilters((current) => ({
      ...current,
      [name]: value,
    }));
  };
  const handleStageChange = (applicant, stage) => {
    setApplicants((rows) =>
      rows.map((row) => (row.id === applicant.id ? { ...row, stage } : row)),
    );
  };
  return (
    <article className="flex flex-col gap-4">
      <PipelineHeading
        heading="Franchise Pipeline"
        subheading="Applicant qualification scorecard — automated scoring engine"
      />

      {/* Filters */}
      <PipelineFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        stages={stages}
        territories={territories}
      />

      {/* Stage overview */}
      <ClientPipelineStageOverview />

      {/* Applicants */}
      <PipelineTable
        filters={filters}
        applicants={applicants}
        onStageChange={handleStageChange}
      />
    </article>
  );
};

export default Pipeline;
