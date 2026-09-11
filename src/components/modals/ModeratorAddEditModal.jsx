import { useState } from "react";
import { X } from "lucide-react";
import Input from "../shared/Input";
import Button from "../shared/Button";
import Select from "../shared/Select";

const STATUSES = ["Active", "Inactive"];

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
}) => {
  const isAdd = mode === "add";

  const [formData, setFormData] = useState(() => ({
    name: initialData?.name || "",
    email: initialData?.email || "",
    password: "",
    role: "Moderator", // the only role there is — see frontend-rules §0
    status: initialData?.status || "Active",
  }));
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") setPasswordError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isAdd) {
      const error = validatePassword(formData.password);
      if (error) {
        setPasswordError(error);
        return;
      }
    }

    // an existing moderator keeps their password — it is never re-sent on edit
    onSubmit(
      isAdd
        ? formData
        : {
            name: formData.name,
            email: formData.email,
            role: formData.role,
            status: formData.status,
          },
    );
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
            aria-label="Close dialog"
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

          {isAdd && (
            <Input
              label="Password *"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Set a password for this moderator"
              isEyeButton
              showConfirm={showPassword}
              setShowConfirm={setShowPassword}
              hint={passwordError}
              hintClassName={passwordError ? "text-remove" : ""}
              required
            />
          )}


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

export default ModeratorAddEditModal;
