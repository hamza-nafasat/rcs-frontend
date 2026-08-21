import { useState } from "react";
import SupportHeading from "./components/SupportHeading";
import SupportFilter from "./components/SupportFilter";
import SupportTable from "./components/SupportTable";

const initialTickets = [
  {
    id: 1,
    ticketId: "#TKT-1001",
    subject: "Unable to upload FDD document",
    category: "Documents",
    priority: "Urgent",
    status: "Open",
    receivedOn: "12 Aug 2026",
    lastUpdated: "14 Aug 2026",
  },
  {
    id: 2,
    ticketId: "#TKT-1002",
    subject: "Franchisee login not working",
    category: "Account",
    priority: "Urgent",
    status: "In Progress",
    receivedOn: "10 Aug 2026",
    lastUpdated: "15 Aug 2026",
  },
  {
    id: 3,
    ticketId: "#TKT-1003",
    subject: "Payment receipt not generated",
    category: "Billing",
    priority: "Medium",
    status: "Resolved",
    receivedOn: "05 Aug 2026",
    lastUpdated: "08 Aug 2026",
  },
  {
    id: 4,
    ticketId: "#TKT-1004",
    subject: "Request to update restaurant brand name",
    category: "General",
    priority: "Low",
    status: "Closed",
    receivedOn: "01 Aug 2026",
    lastUpdated: "03 Aug 2026",
  },
  {
    id: 5,
    ticketId: "#TKT-1005",
    subject: "Request to update restaurant brand name",
    category: "General",
    priority: "Low",
    status: "Closed",
    receivedOn: "05 Aug 2026",
    lastUpdated: "08 Aug 2026",
  },
  {
    id: 6,
    ticketId: "#TKT-1006",
    subject: "Request to update restaurant brand name",
    category: "General",
    priority: "Low",
    status: "Closed",
    receivedOn: "01 Aug 2026",
    lastUpdated: "03 Aug 2026",
  },
  {
    id: 7,
    ticketId: "#TKT-1003",
    subject: "Payment receipt not generated",
    category: "Billing",
    priority: "Medium",
    status: "Resolved",
    receivedOn: "05 Aug 2026",
    lastUpdated: "08 Aug 2026",
  },
];

const initialFilters = {
  priority: [],
  status: [],
  category: [],
};

const Support = () => {
  const [tickets, setTickets] = useState(initialTickets);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(initialFilters);

  // these lists will come from the backend later
  const priorities = [...new Set(tickets.map((ticket) => ticket.priority))];
  const statuses = [...new Set(tickets.map((ticket) => ticket.status))];
  const categories = [...new Set(tickets.map((ticket) => ticket.category))];

  const handleStatusChange = (ticket, status) => {
    setTickets((rows) =>
      rows.map((row) => (row.id === ticket.id ? { ...row, status } : row)),
    );
  };

  const handleDelete = (ticket) => {
    setTickets((rows) => rows.filter((row) => row.id !== ticket.id));
  };

  const filteredTickets = tickets.filter((ticket) => {
    const query = search.trim().toLowerCase();

    const matchSearch =
      ticket.ticketId.toLowerCase().includes(query) ||
      ticket.subject.toLowerCase().includes(query);

    const matchPriority =
      filters.priority.length === 0 ||
      filters.priority.includes(ticket.priority);

    const matchStatus =
      filters.status.length === 0 || filters.status.includes(ticket.status);

    const matchCategory =
      filters.category.length === 0 ||
      filters.category.includes(ticket.category);

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
          priorities={priorities}
          statuses={statuses}
          categories={categories}
        />
      </section>

      <section className="mt-6 min-h-0 flex-1">
        <SupportTable
          tickets={filteredTickets}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      </section>
    </article>
  );
};

export default Support;
