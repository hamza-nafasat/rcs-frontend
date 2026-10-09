import { Search } from "lucide-react";
import Input from "../../../../components/shared/Input";
import Select from "../../../../components/shared/Select";
import { ACCOUNT_STATUS_OPTIONS, FDD_COVERAGE_OPTIONS } from "../utils/clientStatus";

const ClientFilter = ({ filters, setFilters, statuses = [] }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* FDD coverage */}
      <Select
        label="FDD"
        name="fddStatus"
        value={filters.fddStatus}
        onChange={handleChange}
        options={FDD_COVERAGE_OPTIONS}
        placeholder="All FDDs"
        clearable
      />

      {/* Account */}
      <Select
        label="Account"
        name="accountStatus"
        value={filters.accountStatus}
        onChange={handleChange}
        options={ACCOUNT_STATUS_OPTIONS}
        placeholder="All Accounts"
        clearable
      />
    </section>
  );
};

export default ClientFilter;
