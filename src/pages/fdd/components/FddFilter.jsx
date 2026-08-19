import { Search } from "lucide-react";
import Input from "../../../components/shared/Input";

const labelClass = "mb-1 block text-sm font-medium text-[#111111]";
const selectClass =
  "h-10 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 text-sm outline-none focus:border-primary";

const FddFilter = ({ filters, setFilters, countries = [], brands = [] }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Country */}
      <section className="w-full">
        <label htmlFor="country" className={labelClass}>
          Country
        </label>
        <select
          id="country"
          name="country"
          value={filters.country}
          onChange={handleChange}
          className={selectClass}
        >
          <option value="all">All Countries</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </section>

      {/* State / Region */}
      <Input
        label="State / Region"
        name="state"
        value={filters.state}
        onChange={handleChange}
        placeholder="Search by state/region"
        icon={<Search size={16} />}
      />

      {/* Restaurant Brand */}
      <section className="w-full">
        <label htmlFor="brand" className={labelClass}>
          Restaurant Brand
        </label>
        <select
          id="brand"
          name="brand"
          value={filters.brand}
          onChange={handleChange}
          className={selectClass}
        >
          <option value="all">All Restaurants</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </section>

      {/* Document */}
      <Input
        label="Document"
        name="document"
        value={filters.document}
        onChange={handleChange}
        placeholder="Search by document"
        icon={<Search size={16} />}
      />
    </div>
  );
};

export default FddFilter;
