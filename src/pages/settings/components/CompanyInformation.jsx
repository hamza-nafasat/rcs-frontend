import { useState } from "react";
import Input from "../../../components/shared/Input";
import Button from "../../../components/shared/Button";

const INITIAL_COMPANY = {
  name: "",
  email: "",
  phone: "",
  website: "",
  address: "",
  city: "",
  country: "",
};

const CompanyInformation = ({ onSave }) => {
  const [company, setCompany] = useState(INITIAL_COMPANY);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCompany((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave?.(company);
  };

  return (
    <article className="rounded-2xl border color-border bg-white p-6">
      {/* Header */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Company Information
        </h2>

        <p className="mt-1 text-sm text-secondary">
          Update your company profile and contact details.
        </p>
      </section>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Company Name *"
            name="name"
            value={company.name}
            onChange={handleChange}
            placeholder="Enter company name"
            required
          />

          <Input
            label="Company Email *"
            name="email"
            type="email"
            value={company.email}
            onChange={handleChange}
            placeholder="Enter company email"
            required
          />

          <Input
            label="Phone Number"
            name="phone"
            value={company.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
          />

          <Input
            label="Website"
            name="website"
            value={company.website}
            onChange={handleChange}
            placeholder="Enter website URL"
          />
        </section>

        <section>
          <Input
            label="Address"
            name="address"
            value={company.address}
            onChange={handleChange}
            placeholder="Enter street address"
          />
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="City"
            name="city"
            value={company.city}
            onChange={handleChange}
            placeholder="Enter city"
          />

          <Input
            label="Country"
            name="country"
            value={company.country}
            onChange={handleChange}
            placeholder="Enter country"
          />
        </section>

        <section className="flex justify-end pt-2">
          <Button type="submit" className="px-6! py-2.5!">
            Save Changes
          </Button>
        </section>
      </form>
    </article>
  );
};

export default CompanyInformation;
