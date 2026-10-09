import { useState } from "react";
import { X } from "lucide-react";
import Input from "../../../../components/shared/Input";
import Select from "../../../../components/shared/Select";
import Button from "../../../../components/shared/Button";
import { US_STATES } from "../../../../utils/fddStateHelper";

const STATE_OPTIONS = US_STATES.map((state) => state.name);

const ClientAddEditModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  mode = "add",
  isSubmitting = false,
}) => {
  const isEdit = mode === "edit";

  const [formData, setFormData] = useState(() => ({
    restaurantName: initialData?.restaurantName || "",
    clientEmail: initialData?.clientEmail || "",
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    restaurantStates: initialData?.restaurantStates || [],
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
    // an invite carries no states yet
    const { restaurantStates, ...account } = formData;
    onSubmit(isEdit ? { ...account, restaurantStates } : account);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-125 rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <section className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? "Edit Client" : "Add New Client"}
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="First Name *"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
              required
            />
            <Input
              label="Last Name *"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
              required
            />
          </div>
          <Input
            label="Client Email *"
            name="clientEmail"
            type="email"
            value={formData.clientEmail}
            onChange={handleChange}
            placeholder="Enter client email"
            required
          />
          <Input
            label="Restaurant Name *"
            name="restaurantName"
            value={formData.restaurantName}
            onChange={handleChange}
            placeholder="Enter restaurant name"
            required
          />

          {/* Where this brand operates */}
          {isEdit && (
            <div className="flex flex-col gap-1">
              <Select
                label="Operating States"
                name="restaurantStates"
                value={formData.restaurantStates}
                onChange={handleChange}
                options={STATE_OPTIONS}
                placeholder="Select states"
                multiple
                searchable
                clearable
              />

              <p className="text-xs text-muted">
                Each state needs its FDD before this client counts as covered. States with a franchise cannot be
                removed.
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col-reverse gap-3 pt-4 text-sm sm:flex-row">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="w-full sm:w-1/2 text-gray-700! bg-gray-100!"
            >
              Cancel
            </Button>

            <Button type="submit" isLoading={isSubmitting} className="w-full sm:w-1/2">
              {isEdit ? "Update" : "Send Invite"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientAddEditModal;
