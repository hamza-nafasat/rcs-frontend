import { useState } from "react";
import { Camera, Pencil } from "lucide-react";
import Avatar from "../../../components/shared/Avatar";
import Input from "../../../components/shared/Input";
import Button from "../../../components/shared/Button";

const DUMMY_PROFILE = {
  firstName: "Marco",
  lastName: "Ricci",
  email: "marco@goldenfork.com",
  phone: "+1 (555) 000-0000",
  role: { displayName: "Account Owner" },
  address: "123 Market Street",
  city: "Austin",
  state: "TX",
  postalCode: "78701",
  country: "United States",
  teamSize: 12,
  url: "",
  imagePreview: "",
};

const ProfileSetting = ({ profile, onSave, onUpdatePassword }) => {
  const [formData, setFormData] = useState({ ...DUMMY_PROFILE, ...profile });
  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [passwordError, setPasswordError] = useState("");
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const fileChangeHandler = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFormData((current) => ({
      ...current,
      imagePreview: URL.createObjectURL(file),
    }));
  };

  const onEdit = () => {
    setFormError("");
    setIsEditing(true);
  };

  const onCancel = () => {
    setFormData({ ...DUMMY_PROFILE, ...profile });
    setFormError("");
    setIsEditing(false);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsUpdating(true);
    setFormError("");

    try {
      await onSave?.(formData);
      setIsEditing(false);
    } catch {
      setFormError("Unable to save your profile. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswords((current) => ({ ...current, [name]: value }));
    setPasswordError("");
  };

  const togglePasswordVisibility = (name) => {
    setVisiblePasswords((current) => ({
      ...current,
      [name]: !current[name],
    }));
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    if (passwords.newPassword.length < 8) {
      setPasswordError("Your new password must be at least 8 characters.");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    setIsPasswordUpdating(true);
    setPasswordError("");

    try {
      await onUpdatePassword?.(passwords);
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      setPasswordError("Unable to update your password. Please try again.");
    } finally {
      setIsPasswordUpdating(false);
    }
  };

  return (
    <article className=" rounded-xl bg-white relative h-full flex flex-col">
      <section className="shrink-0 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">
            {isEditing ? "Edit Profile" : "My Profile"}
          </h1>

          {!isEditing && (
            <button
              type="button"
              onClick={onEdit}
              aria-label="Edit profile"
              title="Edit profile"
              className="flex items-center justify-center w-10 h-10 rounded-lg cursor-pointer hover:bg-gray-100 transition"
            >
              <Pencil size={18} />
            </button>
          )}
        </div>

        {/*  Profile */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 text-center sm:text-left">
          <div className="relative">
            {formData.imagePreview ? (
              <img
                src={formData.imagePreview}
                className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover shadow-sm"
              />
            ) : (
              <Avatar
                src={formData?.url}
                name={formData?.firstName}
                size={100}
              />
            )}
            {isEditing && (
              <label
                title="Change Image"
                className="absolute bottom-1 right-1 bg-white text-black rounded-full cursor-pointer text-xs p-1"
              >
                <Camera size={17} />
                <Input
                  type="file"
                  onChange={fileChangeHandler}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Info */}
          <div>
            <h2 className="text-xl font-bold">{formData.firstName}</h2>
            <p className="text-gray-500">{formData.email}</p>
          </div>
        </div>
      </section>

      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border-gray-100 flex-1 overflow-y-auto"
      >
        {[
          { label: "First Name", name: "firstName", type: "text" },
          { label: "Last Name", name: "lastName", type: "text" },

          { label: "Email", name: "email", type: "email" },
          { label: "Phone Number", name: "phone", type: "tel" },
          // {
          //   label: "Role / Position",
          //   name: "role",
          //   type: "text",
          //   value: formData.role?.displayName || formData.role?.name || "",
          // },
        ].map((field, idx) => (
          <div key={idx} className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {field.label}
            </label>

            <Input
              name={field.name}
              type={field.type}
              min={field.min}
              max={field.max}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              value={field.value ?? formData[field.name]}
              onChange={onChange}
              disabled={field.name === "role" ? true : !isEditing}
              className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none shadow-sm
          ${
            isEditing && field.name !== "role"
              ? "border-gray-200 focus:border-[#F97316] focus:ring-4 focus:ring-indigo-500/10 bg-white"
              : "bg-gray-50/50 text-gray-500 border-gray-100 cursor-not-allowed"
          }
        `}
            />
          </div>
        ))}

        {/* Address */}
        <div className="md:col-span-2 flex flex-col gap-1.5">
          <Input
            label="Address"
            name="address"
            placeholder="Enter your address"
            value={formData.address}
            onChange={onChange}
            disabled={!isEditing}
            className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none shadow-sm
        ${
          isEditing
            ? "border-gray-200 focus:border-[#F97316] focus:ring-4 focus:ring-indigo-500/10 bg-white"
            : "bg-gray-50/50 text-gray-500 border-gray-100 cursor-not-allowed"
        }
      `}
          />
        </div>

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1.5">
            <Input
              label="City"
              name="city"
              placeholder="City"
              value={formData.city || ""}
              onChange={onChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none shadow-sm
              ${
                isEditing
                  ? "border-gray-200 focus:border-[#F97316] focus:ring-4 focus:ring-indigo-500/10 bg-white"
                  : "bg-gray-50/50 text-gray-500 border-gray-100 cursor-not-allowed"
              }
            `}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Input
              label="State"
              name="state"
              placeholder="State"
              value={formData.state || ""}
              onChange={onChange}
              disabled={!isEditing}
              className={`
              ${
                isEditing
                  ? "border-gray-200 focus:border-[#F97316] focus:ring-4 focus:ring-indigo-500/10 bg-white"
                  : "bg-gray-50/50 text-gray-500 border-gray-100 cursor-not-allowed"
              }
            `}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Input
              label="Postal Code"
              name="postalCode"
              placeholder="Postal Code"
              value={formData.postalCode || ""}
              onChange={onChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none shadow-sm
              ${
                isEditing
                  ? "border-gray-200 focus:border-[#F97316] focus:ring-4 focus:ring-indigo-500/10 bg-white"
                  : "bg-gray-50/50 text-gray-500 border-gray-100 cursor-not-allowed"
              }
            `}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Input
              label="Country"
              name="country"
              placeholder="Country"
              value={formData.country || ""}
              onChange={onChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none shadow-sm
          ${
            isEditing
              ? "border-gray-200 focus:border-[#F97316] focus:ring-4 focus:ring-indigo-500/10 bg-white"
              : "bg-gray-50/50 text-gray-500 border-gray-100 cursor-not-allowed"
          }
        `}
            />
          </div>
        </div>

        {/* Error */}
        {formError && (
          <p className="md:col-span-2 text-sm text-red-500 whitespace-pre-line">
            {formError}
          </p>
        )}

        {/* Buttons */}
        {isEditing && (
          <div className="md:col-span-2 flex justify-end gap-3 mt-4">
            <Button
              type="icon"
              onClick={onCancel}
              className="px-3! py-2! sm:px-4! sm:py-2.5! text-sm rounded cursor-pointer border border-gray-200 transition font-medium"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isUpdating}
              className="px-3! py-2! sm:px-4! sm:py-2.5! text-sm rounded cursor-pointer text-white btn-primary-gradient hover:opacity-90 transition font-medium shadow-sm"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </form>

      <section className="mt-6 p-4">
        <div className="mb-4">
          <h2 className="text-lg font-bold">Password Update</h2>
          <p className="mt-1 text-sm text-gray-500">
            Change your account password securely.
          </p>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {[
            {
              name: "currentPassword",
              label: "Current Password",
              placeholder: "Enter current password",
            },
            {
              name: "newPassword",
              label: "New Password",
              placeholder: "Enter new password",
            },
            {
              name: "confirmPassword",
              label: "Confirm New Password",
              placeholder: "Confirm new password",
            },
          ].map((field) => (
            <Input
              key={field.name}
              {...field}
              type={visiblePasswords[field.name] ? "text" : "password"}
              value={passwords[field.name]}
              onChange={handlePasswordChange}
              isEyeButton
              showConfirm={!!visiblePasswords[field.name]}
              setShowConfirm={() => togglePasswordVisibility(field.name)}
              required
            />
          ))}

          {passwordError && (
            <p className="text-sm text-red-500">{passwordError}</p>
          )}

          <div className="flex justify-end border-t border-gray-100 pt-4">
            <Button
              type="submit"
              disabled={
                isPasswordUpdating ||
                !passwords.currentPassword ||
                !passwords.newPassword ||
                !passwords.confirmPassword
              }
              className="px-3! py-2! sm:px-4! sm:py-2.5! text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPasswordUpdating ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      </section>
    </article>
  );
};

export default ProfileSetting;
