import { useState } from "react";
import toast from "react-hot-toast";
import SupportHeading from "./components/SupportHeading";
import SupportFilter from "./components/SupportFilter";
import SupportTable from "../../../components/global/support/SupportTable";
import SupportDetailsModal from "../../../components/global/support/SupportDetailsModal";
import { SUPPORT_PRIORITY_OPTIONS, SUPPORT_STATUS_OPTIONS, SUPPORT_STATUSES } from "../../../utils/supportStatus";
import {
  useDeleteSupportMutation,
  useGetAllSupportsQuery,
  useUpdateSupportStatusMutation,
} from "../../../store/apis/shared/support.apis";

const initialFilters = {
  priority: [],
  status: [],
  category: [],
};

const AdminSupport = () => {
  const { data, isLoading } = useGetAllSupportsQuery();
  const [updateSupportStatus] = useUpdateSupportStatusMutation();
  const [deleteSupport] = useDeleteSupportMutation();

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(initialFilters);
  const [ticketToView, setTicketToView] = useState(null);

  const tickets = data?.data ?? [];
  const categories = [...new Set(tickets.map((ticket) => ticket.category))];

  // only an admin moves the status
  const handleStatusChange = async (ticket, status) => {
    try {
      const response = await updateSupportStatus({ id: ticket?._id, status }).unwrap();
      toast.success(response?.message);
    } catch (error) {
      console.error("Update ticket status error:", error);
    }
  };

  const handleDelete = async (ticket) => {
    try {
      const response = await deleteSupport(ticket?._id).unwrap();
      toast.success(response?.message);
    } catch (error) {
      console.error("Delete ticket error:", error);
    }
  };

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
          isLoading={isLoading}
          onView={setTicketToView}
          onResolve={(ticket) => handleStatusChange(ticket, SUPPORT_STATUSES.RESOLVED)}
          onClose={(ticket) => handleStatusChange(ticket, SUPPORT_STATUSES.CLOSED)}
          onReopen={(ticket) => handleStatusChange(ticket, SUPPORT_STATUSES.IN_PROGRESS)}
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
