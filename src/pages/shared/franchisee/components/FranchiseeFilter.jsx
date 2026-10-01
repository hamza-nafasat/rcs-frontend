import { Search } from "lucide-react";
import Input from "../../../../components/shared/Input";
import Select from "../../../../components/shared/Select";
import { FRANCHISE_STATUS_OPTIONS } from "../../../../utils/franchiseStatus";

const FranchiseeFilter = ({ filters, setFilters, clientOptions, className = "" }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section
      className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${clientOptions ? "lg:grid-cols-[40fr_30fr_30fr]" : "lg:grid-cols-[70fr_30fr]"} ${className}`}
    >
      {/* Applicant */}
      <Input
        label="Applicant"
        name="search"
        value={filters.search}
        onChange={handleChange}
        placeholder="Search by name or email"
        icon={<Search size={16} />}
      />

      {/* Client, admin only */}
      {clientOptions && (
        <Select
          label="Client"
          name="client"
          value={filters.client}
          onChange={handleChange}
          options={clientOptions}
          placeholder="All Clients"
          multiple
          searchable
          clearable
        />
      )}

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
