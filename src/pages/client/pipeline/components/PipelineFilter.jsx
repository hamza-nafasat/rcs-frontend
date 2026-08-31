import { Search } from "lucide-react";
import Input from "../../../../components/shared/Input";
import Select from "../../../../components/shared/Select";

const PipelineFilter = ({
  filters,
  onFilterChange,
  stages = [],
  territories = [],
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-[35fr_15fr_15fr]">
      {/* Applicant */}
      <Input
        label="Application"
        name="applicant"
        value={filters.applicant}
        onChange={handleChange}
        placeholder="Search by applicant or ID"
        icon={<Search size={16} />}
      />

      {/* Stage */}
      <Select
        label="Stage"
        name="stage"
        value={filters.stage}
        onChange={handleChange}
        options={stages}
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
