import { useState } from "react";
import { X } from "lucide-react";
import Button from "../../../../components/shared/Button";
import SupportCreateTicketForm from "../components/SupportCreateTicketForm";
import { EMPTY_TICKET } from "../utils/data";

const SupportEditModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState(() => ({ ...EMPTY_TICKET, ...initialData }));

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <header className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-tertiary">Edit Ticket</h2>
            <p className="mt-0.5 text-sm text-secondary">{initialData?.ticketId}</p>
          </div>

          <Button
            variant="bare"
            onClick={onClose}
            aria-label="Close"
            className="p-1! m-1! rounded-full! text-secondary transition hover:bg-gray-100"
          >
            <X size={20} />
          </Button>
        </header>

        <SupportCreateTicketForm
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitText="Save Changes"
        />
      </div>
    </div>
  );
};

export default SupportEditModal;
