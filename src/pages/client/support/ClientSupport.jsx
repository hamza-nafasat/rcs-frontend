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

      // TODO: submit the ticket once the support API lands
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