import { useState } from "react";
import SupportCreateTicketForm from "./components/SupportCreateTicketForm";
import SupportEditModal from "./modals/SupportEditModal";
import SupportTable from "../../../components/global/support/SupportTable";
import SupportDetailsModal from "../../../components/global/support/SupportDetailsModal";
import { EMPTY_TICKET, initialTickets } from "./utils/data";

const ClientSupport = () => {
  // TODO: wire the support API
  const [tickets, setTickets] = useState(initialTickets);
  const [form, setForm] = useState(EMPTY_TICKET);
  const [ticketToView, setTicketToView] = useState(null);
  const [ticketToEdit, setTicketToEdit] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setForm(EMPTY_TICKET);
  };

  const handleUpdate = (updated) => {
    setTickets((rows) => rows.map((row) => (row.id === ticketToEdit.id ? { ...row, ...updated } : row)));
    setTicketToEdit(null);
  };

  const handleDelete = (ticket) => setTickets((rows) => rows.filter((row) => row.id !== ticket.id));

  return (
    <article className="flex flex-col gap-6">
      <section>
        <SupportCreateTicketForm
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => setForm(EMPTY_TICKET)}
        />
      </section>

      {/* My Requests */}
      <section>
        <header className="mb-3">
          <h2 className="card-heading">My Support Requests</h2>
          <p className="text-sm text-secondary">Track the requests you have raised and their current status.</p>
        </header>

        <SupportTable
          tickets={tickets}
          onView={setTicketToView}
          onEdit={setTicketToEdit}
          onDelete={handleDelete}
        />
      </section>

      <SupportDetailsModal
        isOpen={Boolean(ticketToView)}
        onClose={() => setTicketToView(null)}
        ticket={ticketToView}
      />

      {ticketToEdit && (
        <SupportEditModal
          isOpen={Boolean(ticketToEdit)}
          onClose={() => setTicketToEdit(null)}
          onSubmit={handleUpdate}
          initialData={ticketToEdit}
        />
      )}
    </article>
  );
};

export default ClientSupport;
