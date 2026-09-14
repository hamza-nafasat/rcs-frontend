import { useState } from "react";
import { X } from "lucide-react";
import Input from "../shared/Input";
import Button from "../shared/Button";
import Select from "../shared/Select";
import { US_STATES } from "../../utils/fddStateHelper";
import { MODERATOR_STATUS_OPTIONS } from "../../utils/moderatorStatus";

const STATE_OPTIONS = US_STATES.map((state) => state.name);

// Returns an error message, or "" when the password is acceptable.
const validatePassword = (password) => {
  if (!password) return "Password is required";

  // TODO(human)
  return "";
};

const ModeratorAddEditModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  mode = "add",
  isSubmitting = false,
}) => {
  const isAdd = mode === "add";

  const [formData, setFormData] = useState(() => ({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    postalCode: initialData?.postalCode || "",
    country: initialData?.country || "United States",
    status: initialData?.status || "active",
  }));
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // an existing moderator keeps their password — it is never re-sent on edit
    if (!isAdd) return onSubmit(formData);

    const error = validatePassword(password);
    if (error) return setPasswordError(error);
    onSubmit(formData, password);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-150 overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === "edit" ? "Edit Moderator" : "Add New Moderator"}
          </h2>

          <button
            aria-label="Close dialog"
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          <Input
            label="Email *"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
          />
          <Input
            label="Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
          />

          {isAdd && (
            <div className="sm:col-span-2">
              <Input
                label="Password *"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Set a password for this moderator"
                isEyeButton
                showConfirm={showPassword}
                setShowConfirm={setShowPassword}
                hint={passwordError}
                hintClassName={passwordError ? "text-remove" : ""}
                required
              />
            </div>
          )}

          <div className="sm:col-span-2">
            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter street address"
            />
          </div>
          <Input
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter city"
          />
          <Select
            label="State"
            name="state"
            value={formData.state}
            onChange={handleChange}
            options={STATE_OPTIONS}
            placeholder="Select state"
            searchable
          />
          <Input
            label="Postal Code"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="Enter postal code"
          />
          <Input
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Enter country"
          />
          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={MODERATOR_STATUS_OPTIONS}
            placeholder="Select status"
          />

          {/* Buttons */}
          <div className="flex gap-3 pt-4 sm:col-span-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="w-1/2 text-gray-700! bg-gray-100!"
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting} className="w-1/2">
              {isSubmitting ? "Saving..." : mode === "edit" ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModeratorAddEditModal;
