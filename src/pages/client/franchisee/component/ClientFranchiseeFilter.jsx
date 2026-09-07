import { Search } from "lucide-react";
import Input from "../../../../components/shared/Input";
import Select from "../../../../components/shared/Select";

const DEFAULT_STATUSES = ["Active", "On Hold", "At Risk"];

const ClientFranchiseeFilter = ({
  filters,
  setFilters,
  statuses = DEFAULT_STATUSES,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[35fr_35fr_30fr]">
      {/* Restaurant */}
      <Input
        label="Restaurant"
        name="restaurant"
        value={filters.restaurant}
        onChange={handleChange}
        placeholder="Search by restaurant name"
        icon={<Search size={16} />}
      />

      {/* Owner */}
      <Input
        label="Owner"
        name="owner"
        value={filters.owner}
        onChange={handleChange}
        placeholder="Search by owner name"
        icon={<Search size={16} />}
      />

      {/* Status */}
      <Select
        label="Status"
        name="status"
        value={filters.status}
        onChange={handleChange}
        options={statuses}
        placeholder="All Statuses"
        multiple
        searchable
        clearable
      />
    </section>
  );
};

export default ClientFranchiseeFilter;
