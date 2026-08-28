import { useState } from "react";
import { X } from "lucide-react";
import Input from "../../../../components/shared/Input";
import Button from "../../../../components/shared/Button";
import Select from "../../../../components/shared/Select";

const ROLES = ["Moderator", "Account Owner"];
const STATUSES = ["Active", "Inactive", "Pending"];

const ClientAddEditModeratorModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  mode = "add",
}) => {
  const [formData, setFormData] = useState(() => ({
    name: initialData?.name || "",
    email: initialData?.email || "",
    role: initialData?.role || "Moderator",
    status: initialData?.status || "Pending",
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
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === "edit" ? "Edit Moderator" : "Add New Moderator"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter member name"
            required
          />
          <Input
            label="Email *"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter member email"
            required
          />

          <Select
            label="Role *"
            name="role"
            value={formData.role}
            onChange={handleChange}
            options={ROLES}
            placeholder="Select role"
            labelClassName="mb-2"
            required
          />

          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={STATUSES}
            placeholder="Select status"
            labelClassName="mb-2"
          />

          {/* Buttons */}
          <div className="flex  gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="w-1/2 text-gray-700! bg-gray-100!"
            >
              Cancel
            </Button>

            <Button type="submit" className="w-1/2">
              {mode === "edit" ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientAddEditModeratorModal;
