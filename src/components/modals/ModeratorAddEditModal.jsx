import { useState } from "react";
import { X } from "lucide-react";
import Input from "../shared/Input";
import Button from "../shared/Button";
import Select from "../shared/Select";
import LocationFields from "../global/LocationFields";
import PhoneInput from "../shared/PhoneInput";
import { MODERATOR_STATUS_OPTIONS } from "../../utils/moderatorStatus";

// an error message, or empty
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

    // an edit never resends the password
    if (!isAdd) return onSubmit(formData);

    const error = validatePassword(password);
    if (error) return setPasswordError(error);
    onSubmit(formData, password);
  };

  // every required field has a value
  const isComplete =
    [formData.firstName, formData.lastName, formData.email, formData.phone].every((value) => value.trim() !== "") &&
    (!isAdd || password !== "");

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
          <PhoneInput label="Phone *" value={formData.phone} onChange={handleChange} required />

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
          <LocationFields values={formData} onChange={handleChange} />
          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={MODERATOR_STATUS_OPTIONS}
            placeholder="Select status"
          />

          {/* Buttons */}
          <div className="flex flex-col-reverse gap-3 pt-4 sm:col-span-2 sm:flex-row">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="w-full sm:w-1/2 text-gray-700! bg-gray-100!"
            >
              Cancel
            </Button>

            <Button type="submit" isLoading={isSubmitting} isDisabled={!isComplete} className="w-full sm:w-1/2">
              {mode === "edit" ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModeratorAddEditModal;
