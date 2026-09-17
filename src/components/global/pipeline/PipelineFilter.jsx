import { Search } from "lucide-react";
import Input from "../../shared/Input";
import Select from "../../shared/Select";
import { PIPELINE_STAGE_OPTIONS } from "../../../utils/pipelineStage";

const PipelineFilter = ({ filters, setFilters, territories = [], className = "" }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[35fr_35fr_15fr_15fr] ${className}`}>
      {/* Applicant */}
      <Input
        label="Applicant"
        name="applicant"
        value={filters.applicant}
        onChange={handleChange}
        placeholder="Search by applicant or email"
        icon={<Search size={16} />}
      />

      {/* Franchise */}
      <Input
        label="Franchise"
        name="franchise"
        value={filters.franchise}
        onChange={handleChange}
        placeholder="Search by franchise"
        icon={<Search size={16} />}
      />

      {/* Stage */}
      <Select
        label="Stage"
        name="stage"
        value={filters.stage}
        onChange={handleChange}
        options={PIPELINE_STAGE_OPTIONS}
        placeholder="All Stages"
        multiple
        searchable
        clearable
      />

      {/* Territory */}
      <Select
        label="Territory"
        name="territory"
        value={filters.territory}
        onChange={handleChange}
        options={territories}
        placeholder="All Territories"
        multiple
        searchable
        clearable
      />
    </section>
  );
};

export default PipelineFilter;
