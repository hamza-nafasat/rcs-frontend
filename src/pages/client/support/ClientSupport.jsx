import { useState } from "react";
import toast from "react-hot-toast";
import SupportCreateTicketForm from "./components/SupportCreateTicketForm";
import SupportEditModal from "./modals/SupportEditModal";
import SupportTable from "../../../components/global/support/SupportTable";
import SupportDetailsModal from "../../../components/global/support/SupportDetailsModal";
import { isEditableTicket } from "../../../utils/supportStatus";
import { EMPTY_TICKET } from "./utils/data";
import { toTicketFormData } from "./utils/supportRequest";
import {
  useCreateSupportMutation,
  useDeleteSupportMutation,
  useGetAllSupportsQuery,
  useUpdateSupportMutation,
} from "../../../store/apis/shared/support.apis";

const ClientSupport = () => {
  const { data, isLoading } = useGetAllSupportsQuery();
  const [createSupport, { isLoading: isCreating }] = useCreateSupportMutation();
  const [updateSupport, { isLoading: isUpdating }] = useUpdateSupportMutation();
  const [deleteSupport] = useDeleteSupportMutation();

  const [form, setForm] = useState(EMPTY_TICKET);
  const [ticketToView, setTicketToView] = useState(null);
  const [ticketToEdit, setTicketToEdit] = useState(null);

  const tickets = data?.data ?? [];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await createSupport(toTicketFormData(form)).unwrap();
      toast.success(response?.message);
      setForm(EMPTY_TICKET);
    } catch (error) {
      console.error("Raise ticket error:", error);
    }
  };

  const handleUpdate = async (updated) => {
    try {
      const response = await updateSupport({
        id: ticketToEdit?._id,
        body: toTicketFormData(updated),
      }).unwrap();
      toast.success(response?.message);
      setTicketToEdit(null);
    } catch (error) {
      console.error("Update ticket error:", error);
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

  return (
    <article className="flex flex-col gap-6">
      <section>
        <SupportCreateTicketForm
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => setForm(EMPTY_TICKET)}
          isSubmitting={isCreating}
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
          isLoading={isLoading}
          onView={setTicketToView}
          onEdit={setTicketToEdit}
          onDelete={handleDelete}
          canDelete={isEditableTicket}
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
          isSubmitting={isUpdating}
        />
      )}
    </article>
  );
};

export default ClientSupport;
