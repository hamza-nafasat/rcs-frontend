import { Search } from "lucide-react";
import Input from "../../../../components/shared/Input";
import Select from "../../../../components/shared/Select";

const SupportFilter = ({
  search,
  setSearch,
  filters,
  setFilters,
  priorities = [],
  statuses = [],
  categories = [],
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[40fr_20fr_20fr_20fr]">
      <Input
        name="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by Ticket ID or Subject"
        icon={<Search size={16} />}
        iconPosition="left"
      />

      {/* Priority */}
      <Select
        name="priority"
        value={filters.priority}
        onChange={handleChange}
        options={priorities}
        placeholder="All Priorities"
        multiple
        searchable
        clearable
      />

      {/* Status */}
      <Select
        name="status"
        value={filters.status}
        onChange={handleChange}
        options={statuses}
        placeholder="All Statuses"
        multiple
        searchable
        clearable
      />

      {/* Category */}
      <Select
        name="category"
        value={filters.category}
        onChange={handleChange}
        options={categories}
        placeholder="All Categories"
        multiple
        searchable
        clearable
      />
    </section>
  );
};

export default SupportFilter;
