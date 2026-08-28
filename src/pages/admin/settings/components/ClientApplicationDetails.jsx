import { useState } from "react";
import ApplicationFields from "../../../public/auth/components/ApplicationFields";
import {
  EMPTY_APPLICATION,
  scoreApplication,
} from "../../../public/auth/utils/applicationScore";

const ClientApplicationDetails = () => {
  const [form, setForm] = useState(EMPTY_APPLICATION);
  const scores = scoreApplication(form);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelect = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className="p-4">
      <ApplicationFields
        form={form}
        scores={scores}
        onChange={handleChange}
        onSelect={handleSelect}
      />
    </section>
  );
};

export default ClientApplicationDetails;
