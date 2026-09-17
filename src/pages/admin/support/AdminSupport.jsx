import { useState } from "react";
import SupportHeading from "./components/SupportHeading";
import SupportFilter from "./components/SupportFilter";
import SupportTable from "../../../components/global/support/SupportTable";
import SupportDetailsModal from "../../../components/global/support/SupportDetailsModal";
import { initialTickets } from "./utils/data";
import { SUPPORT_PRIORITY_OPTIONS, SUPPORT_STATUS_OPTIONS, SUPPORT_STATUSES } from "../../../utils/supportStatus";

const initialFilters = {
  priority: [],
  status: [],
  category: [],
};

const AdminSupport = () => {
  // TODO: wire the support API
  const [tickets, setTickets] = useState(initialTickets);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(initialFilters);
  const [ticketToView, setTicketToView] = useState(null);

  const categories = [...new Set(tickets.map((ticket) => ticket.category))];

  // only an admin moves the status
  const handleStatusChange = (ticket, status) =>
    setTickets((rows) => rows.map((row) => (row.id === ticket.id ? { ...row, status } : row)));

  const handleDelete = (ticket) => setTickets((rows) => rows.filter((row) => row.id !== ticket.id));

  const filteredTickets = tickets.filter((ticket) => {
    const query = search.trim().toLowerCase();
    const matchSearch =
      ticket.ticketId.toLowerCase().includes(query) || ticket.subject.toLowerCase().includes(query);
    const matchPriority = filters.priority.length === 0 || filters.priority.includes(ticket.priority);
    const matchStatus = filters.status.length === 0 || filters.status.includes(ticket.status);
    const matchCategory = filters.category.length === 0 || filters.category.includes(ticket.category);

    return matchSearch && matchPriority && matchStatus && matchCategory;
  });

  return (
    <article className="flex h-full min-h-0 flex-col">
      <section>
        <SupportHeading
          heading="Support Tickets"
          subheading="Monitor, track, and manage all incoming support requests for the franchise platform."
        />
      </section>

      <section className="mt-6">
        <SupportFilter
          search={search}
          setSearch={setSearch}
          filters={filters}
          setFilters={setFilters}
          priorities={SUPPORT_PRIORITY_OPTIONS}
          statuses={SUPPORT_STATUS_OPTIONS}
          categories={categories}
        />
      </section>

      <section className="mt-6 min-h-0 flex-1">
        <SupportTable
          tickets={filteredTickets}
          onView={setTicketToView}
          onResolve={(ticket) => handleStatusChange(ticket, SUPPORT_STATUSES.RESOLVED)}
          onClose={(ticket) => handleStatusChange(ticket, SUPPORT_STATUSES.CLOSED)}
          onDelete={handleDelete}
        />
      </section>

      <SupportDetailsModal
        isOpen={Boolean(ticketToView)}
        onClose={() => setTicketToView(null)}
        ticket={ticketToView}
      />
    </article>
  );
};

export default AdminSupport;
