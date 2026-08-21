import { Search } from "lucide-react";
import Input from "../../../components/shared/Input";
import Select from "../../../components/shared/Select";

const FddFilter = ({ filters, setFilters, countries = [], brands = [] }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[35fr_35fr_15fr_15fr]">
      {/* Document */}
      <Input
        label="Document"
        name="document"
        value={filters.document}
        onChange={handleChange}
        placeholder="Search by document"
        icon={<Search size={16} />}
      />

      {/* State / Region */}
      <Input
        label="State / Region"
        name="state"
        value={filters.state}
        onChange={handleChange}
        placeholder="Search by state/region"
        icon={<Search size={16} />}
      />

      {/* Country */}
      <Select
        label="Country"
        name="country"
        value={filters.country}
        onChange={handleChange}
        options={countries}
        placeholder="All Countries"
        multiple
        searchable
        clearable
      />

      {/* Restaurant Brand */}
      <Select
        label="Restaurant Brand"
        name="brand"
        value={filters.brand}
        onChange={handleChange}
        options={brands}
        placeholder="All Restaurants"
        multiple
        searchable
        clearable
      />
    </section>
  );
};

export default FddFilter;
