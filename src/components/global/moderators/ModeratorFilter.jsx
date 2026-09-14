import { Search } from "lucide-react";
import Input from "../../shared/Input";
import Select from "../../shared/Select";
import { MODERATOR_STATUS_OPTIONS } from "../../../utils/moderatorStatus";

const ModeratorFilter = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-[2fr_1fr]">
      {/* Name */}
      <Input
        label="Name"
        name="name"
        value={filters.name}
        onChange={handleChange}
        placeholder="Search by name"
        icon={<Search size={16} />}
      />

      {/* Status */}
      <Select
        label="Status"
        name="status"
        value={filters.status}
        onChange={handleChange}
        options={MODERATOR_STATUS_OPTIONS}
        placeholder="All Statuses"
        multiple
        clearable
      />
    </section>
  );
};

export default ModeratorFilter;
