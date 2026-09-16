import { useState } from "react";
import SupportCreateTicketForm from "./components/SupportCreateTicketForm"

const ClientSupport = () => {
    const [form, setForm] = useState({
        subject: "",
        category: "",
        priority: "",
        description: "",
        attachment: null,
      });
      
      const handleChange = (e) => {
        const { name, value } = e.target;
      
        setForm((prev) => ({
          ...prev,
          [name]: value,
        }));
      };

      // TODO: wire the support API
      const handleSubmit = (e) => {
        e.preventDefault();
      };
  return (
    <>
        <section>
            <SupportCreateTicketForm
                form={form}
                onChange={handleChange}
                onSubmit={handleSubmit}
            />
        </section>
    </>
);
};

export default ClientSupport;