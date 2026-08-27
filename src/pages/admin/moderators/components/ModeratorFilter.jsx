import { Search } from "lucide-react";
import Input from "../../../../components/shared/Input";
import Select from "../../../../components/shared/Select";

const ModeratorFilter = ({ filters, setFilters, roles = [], statuses = [] }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[50fr_25fr_25fr]">
      {/* Name */}
      <Input
        label="Name"
        name="name"
        value={filters.name}
        onChange={handleChange}
        placeholder="Search by name"
        icon={<Search size={16} />}
      />

      {/* Role */}
      <Select
        label="Role"
        name="role"
        value={filters.role}
        onChange={handleChange}
        options={roles}
        placeholder="All Roles"
        multiple
        searchable
        clearable
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

export default ModeratorFilter;
