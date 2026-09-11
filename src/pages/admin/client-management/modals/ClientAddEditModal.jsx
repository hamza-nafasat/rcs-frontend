import { useState } from "react";
import { X } from "lucide-react";
import Input from "../../../../components/shared/Input";
import Button from "../../../../components/shared/Button";

const ClientAddEditModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  mode = "add",
}) => {
  const [formData, setFormData] = useState(() => ({
    restaurantName: initialData?.restaurantName || "",
    clientEmail: initialData?.clientEmail || "",
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-125 rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <section className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === "edit" ? "Edit Client" : "Add New Client"}
          </h2>

          <button
            aria-label="Close dialog"
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </section>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Restaurant / Company Name *"
            name="restaurantName"
            value={formData.restaurantName}
            onChange={handleChange}
            placeholder="Enter restaurant / company name"
            required
          />
          <Input
            label="Client Email *"
            name="clientEmail"
            type="email"
            value={formData.clientEmail}
            onChange={handleChange}
            placeholder="Enter client email"
            required
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Owner First Name *"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
              required
            />
            <Input
              label="Owner Last Name *"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 text-sm">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="w-1/2 text-gray-700! bg-gray-100!"
            >
              Cancel
            </Button>

            <Button type="submit" className="w-1/2">
              {mode === "edit" ? "Update" : "Send Invite"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientAddEditModal;
