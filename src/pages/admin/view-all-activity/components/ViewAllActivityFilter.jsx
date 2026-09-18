import Select from "../../../../components/shared/Select";
import { ACTIVITY_ACTION_OPTIONS, ACTIVITY_MODULE_OPTIONS } from "../../../../utils/activityLog";

const ViewAllActivityFilter = ({ filters, setFilters, moderators = [], className = "" }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className={`grid grid-cols-1 gap-4 sm:grid-cols-3 ${className}`}>
      <Select
        label="Moderator"
        name="moderator"
        value={filters.moderator}
        onChange={handleChange}
        options={moderators}
        placeholder="All Moderators"
        multiple
        searchable
        clearable
      />

      <Select
        label="Action"
        name="action"
        value={filters.action}
        onChange={handleChange}
        options={ACTIVITY_ACTION_OPTIONS}
        placeholder="All Actions"
        multiple
        clearable
      />

      <Select
        label="Module"
        name="module"
        value={filters.module}
        onChange={handleChange}
        options={ACTIVITY_MODULE_OPTIONS}
        placeholder="All Modules"
        multiple
        searchable
        clearable
      />
    </section>
  );
};

export default ViewAllActivityFilter;
