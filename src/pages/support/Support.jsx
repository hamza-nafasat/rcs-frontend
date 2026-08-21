import { useState } from "react";
import SupportHeading from "./components/SupportHeading";
import SupportSearch from "./components/SupportSearch";
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

const Support = () => {
  const [tickets] = useState(initialTickets);
  const [search, setSearch] = useState("");

  const filteredTickets = tickets.filter((ticket) => {
    const query = search.trim().toLowerCase();

    return (
      ticket.ticketId.toLowerCase().includes(query) ||
      ticket.subject.toLowerCase().includes(query)
    );
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
        <SupportSearch search={search} setSearch={setSearch} />
      </section>

      <section className="mt-6 min-h-0 flex-1">
        <SupportTable tickets={filteredTickets} />
      </section>
    </article>
  );
};

export default Support;
