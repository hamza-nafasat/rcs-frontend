import { useState } from "react";
import PipelineFilter from "./components/PipelineFilter";
import PipelineHeading from "../../../components/global/PipelineHeading";
import PipelineTable from "./components/PipelineTable";
import PipelineStageOverview from "./components/PipelineStageOverview";
import { initialApplicants } from "./utils/data";

const initialFilters = {
  applicant: "",
  franchise: "",
  stage: [],
  territory: [],
};

const ClientPipeline = () => {
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
      <PipelineStageOverview />

      {/* Applicants */}
      <PipelineTable
        filters={filters}
        applicants={applicants}
        onStageChange={handleStageChange}
      />
    </article>
  );
};

export default ClientPipeline;
