import { Search } from "lucide-react";
import Input from "../../../../components/shared/Input";
import Select from "../../../../components/shared/Select";
import { FRANCHISE_STATUS_OPTIONS } from "../../../../utils/franchiseStatus";

const FranchiseeFilter = ({ filters, setFilters, className = "" }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[70fr_30fr] ${className}`}>
      {/* Applicant */}
      <Input
        label="Applicant"
        name="search"
        value={filters.search}
        onChange={handleChange}
        placeholder="Search by name or email"
        icon={<Search size={16} />}
      />

      {/* Franchise status */}
      <Select
        label="Franchise Status"
        name="status"
        value={filters.status}
        onChange={handleChange}
        options={FRANCHISE_STATUS_OPTIONS}
        placeholder="All Statuses"
        multiple
        searchable
        clearable
      />
    </section>
  );
};

export default FranchiseeFilter;
