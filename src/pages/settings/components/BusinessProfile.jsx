import { useState } from "react";
import Input from "../../../components/shared/Input";
import Button from "../../../components/shared/Button";
import CardHeading from "./CardHeading";
import { EMPTY_PROFILE, FIELD_LABEL_CLASS } from "../constants";

const FIELDS = [
  {
    name: "applicantName",
    label: "Applicant Name *",
    placeholder: "Enter applicant name",
    required: true,
  },
  {
    name: "companyName",
    label: "Company Name",
    placeholder: "Enter company name",
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "Enter email address",
  },
  { name: "phone", label: "Phone Number", placeholder: "+1 (555) 000-0000" },
  { name: "city", label: "City", placeholder: "e.g. Chicago" },
  { name: "state", label: "State", placeholder: "e.g. IL" },
];

const BusinessProfile = ({ profile, onSave }) => {
  const [form, setForm] = useState({ ...EMPTY_PROFILE, ...profile });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave?.(form);
  };

  return (
    <article className="rounded-2xl border color-border bg-white p-5">
      <CardHeading
        heading="Business Profile"
        subheading="Update your contact details and business information"
      />

      <form onSubmit={handleSubmit} className="mt-5">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {FIELDS.map(({ name, ...field }) => (
            <Input
              key={name}
              name={name}
              value={form[name]}
              onChange={handleChange}
              labelClassName={FIELD_LABEL_CLASS}
              {...field}
            />
          ))}
        </section>

        <footer className="mt-5 flex items-center justify-between gap-4 border-t color-border pt-4">
          <p className="text-xs text-muted">* Required field</p>

          <Button type="submit" className="px-5! py-2.5! text-sm">
            Save Profile
          </Button>
        </footer>
      </form>
    </article>
  );
};

export default BusinessProfile;
