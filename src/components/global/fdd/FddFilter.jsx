import { Search } from "lucide-react";
import Input from "../../shared/Input";
import Select from "../../shared/Select";
import { FDD_STATE_OPTIONS } from "../../../utils/fddStateHelper";
import { FDD_STATUS_OPTIONS } from "../../../utils/fddStatus";

// clients are passed on admin only
const FddFilter = ({ filters, setFilters, clients = [] }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${clients.length > 0 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
      {/* Document */}
      <Input
        label="Document"
        name="search"
        value={filters.search}
        onChange={handleChange}
        placeholder="Search by title"
        icon={<Search size={16} />}
      />

      {clients.length > 0 && (
        <Select
          label="Restaurant"
          name="client"
          value={filters.client}
          onChange={handleChange}
          options={clients}
          placeholder="All Restaurants"
          searchable
          clearable
        />
      )}

      {/* State */}
      <Select
        label="State"
        name="state"
        value={filters.state}
        onChange={handleChange}
        options={FDD_STATE_OPTIONS}
        placeholder="All States"
        searchable
        clearable
      />

      {/* Status */}
      <Select
        label="Status"
        name="status"
        value={filters.status}
        onChange={handleChange}
        options={FDD_STATUS_OPTIONS}
        placeholder="All Statuses"
        clearable
      />
    </section>
  );
};

export default FddFilter;
