import { useState } from "react";
import { Camera, Pencil } from "lucide-react";
import Avatar from "../../../../components/shared/Avatar";
import Input from "../../../../components/shared/Input";
import Button from "../../../../components/shared/Button";
import LocationFields from "../../../../components/global/LocationFields";
import SettingsClientApplicationDetails from "./SettingsClientApplicationDetails";
import { PASSWORD_MIN_LENGTH } from "../../auth/utils/accountRules";
import {
  CLIENT_FIELDS,
  EMPTY_PASSWORDS,
  EMPTY_PROFILE,
  PASSWORD_INPUTS,
  PERSONAL_INPUTS,
  PROFILE_FIELDS,
} from "../utils/data";

const EDITABLE_INPUT = "border-gray-200 focus:border-[#F97316] focus:ring-4 focus:ring-indigo-500/10 bg-white";
const LOCKED_INPUT = "bg-gray-50/50 text-gray-500 border-gray-100 cursor-not-allowed";

// only the values the api has
const pickFilled = (source, fields) =>
  Object.fromEntries(fields.filter((field) => source?.[field] != null).map((field) => [field, source[field]]));

const toForm = (profile) => ({
  ...EMPTY_PROFILE,
  ...pickFilled(profile, [...PROFILE_FIELDS, "email"]),
  ...pickFilled(profile?.client, CLIENT_FIELDS),
});

const SettingsProfileSetting = ({
  profile,
  isClient = false,
  isSaving = false,
  isChangingPassword = false,
  onSave,
  onUpdatePassword,
}) => {
  const [form, setForm] = useState(() => toForm(profile));
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [passwords, setPasswords] = useState(EMPTY_PASSWORDS);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSelect = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  // swap image, free old preview
  const replaceImage = (file) => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : "");
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) replaceImage(file);
  };

  const handleCancel = () => {
    setForm(toForm(profile));
    replaceImage(null);
    setIsEditing(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await onSave?.(form, image);
      replaceImage(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Update profile error:", error);
    }
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
    setPasswordError("");
  };

  const togglePasswordVisibility = (name) => setVisiblePasswords((prev) => ({ ...prev, [name]: !prev[name] }));

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    if (passwords.newPassword.length < PASSWORD_MIN_LENGTH)
      return setPasswordError(`Your new password must be at least ${PASSWORD_MIN_LENGTH} characters.`);
    if (passwords.newPassword !== passwords.confirmPassword)
      return setPasswordError("New password and confirmation do not match.");

    try {
      await onUpdatePassword?.(passwords);
      setPasswords(EMPTY_PASSWORDS);
    } catch (error) {
      console.error("Change password error:", error);
    }
  };

  return (
    <article className="rounded-xl bg-white relative h-full flex flex-col">
      <section className="shrink-0 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{isEditing ? "Edit Profile" : "My Profile"}</h1>

          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              aria-label="Edit profile"
              title="Edit profile"
              className="flex items-center justify-center w-10 h-10 rounded-lg cursor-pointer hover:bg-gray-100 transition"
            >
              <Pencil size={18} />
            </button>
          )}
        </div>

        {/* Profile */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 text-center sm:text-left">
          <div className="relative">
            <Avatar src={imagePreview || profile?.image?.url} name={profile?.fullName} size={100} />
            {isEditing && (
              <label
                title="Change Image"
                className="absolute bottom-1 right-1 bg-white text-black rounded-full cursor-pointer text-xs p-1"
              >
                <Camera size={17} />
                <input
                  type="file"
                  accept="image/*"
                  aria-label="Change image"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-xl font-bold">{profile?.fullName}</h2>
            <p className="truncate text-gray-500">{profile?.email}</p>
          </div>
        </div>
      </section>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border-gray-100 flex-1 overflow-y-auto"
      >
        {PERSONAL_INPUTS.map(({ label, name, type = "text", isLocked = false, isWide = false, isRequired = false }) => (
          <div key={name} className={isWide ? "md:col-span-2" : ""}>
            <Input
              label={isRequired ? `${label} *` : label}
              name={name}
              type={type}
              placeholder={`Enter ${label.toLowerCase()}`}
              value={form[name] ?? ""}
              onChange={handleChange}
              disabled={isLocked || !isEditing}
              required={isRequired}
              hint={isLocked && isEditing ? "Email cannot be changed" : undefined}
              className={`px-4 py-3 shadow-sm transition-all ${isEditing && !isLocked ? EDITABLE_INPUT : LOCKED_INPUT}`}
            />
          </div>
        ))}
        <LocationFields values={form} onChange={handleChange} disabled={!isEditing} />

        <label className="md:col-span-2 flex items-center gap-2 text-sm text-tertiary">
          <input
            type="checkbox"
            name="isEmailNotificationEnabled"
            checked={Boolean(form.isEmailNotificationEnabled)}
            onChange={handleChange}
            disabled={!isEditing}
            className="h-4 w-4 accent-(--color-primary) disabled:cursor-not-allowed"
          />
          Send me email notifications
        </label>

        {isClient && (
          <div className="md:col-span-2">
            <SettingsClientApplicationDetails
              form={form}
              onChange={handleChange}
              onSelect={handleSelect}
              disabled={!isEditing}
            />
          </div>
        )}

        {/* Buttons */}
        {isEditing && (
          <div className="md:col-span-2 flex justify-end gap-3 mt-4">
            <Button
              variant="bare"
              onClick={handleCancel}
              className="px-3! py-2! sm:px-4! sm:py-2.5! text-sm rounded cursor-pointer border border-gray-200 transition font-medium"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              isLoading={isSaving}
              className="px-3! py-2! sm:px-4! sm:py-2.5! text-sm rounded cursor-pointer text-white btn-primary-gradient hover:opacity-90 transition font-medium shadow-sm"
            >
              Save Changes
            </Button>
          </div>
        )}
      </form>

      <section className="mt-6 p-4">
        <div className="mb-4">
          <h2 className="text-lg font-bold">Password Update</h2>
          <p className="mt-1 text-sm text-gray-500">Change your account password securely.</p>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {PASSWORD_INPUTS.map((field) => (
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

          {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}

          <div className="flex justify-end border-t border-gray-100 pt-4">
            <Button
              type="submit"
              isLoading={isChangingPassword}
              isDisabled={!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword}
              className="px-3! py-2! sm:px-4! sm:py-2.5! text-sm font-medium text-white transition hover:opacity-90"
            >
              Update Password
            </Button>
          </div>
        </form>
      </section>
    </article>
  );
};

export default SettingsProfileSetting;
