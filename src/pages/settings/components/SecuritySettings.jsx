import { useState } from "react";
import Input from "../../../components/shared/Input";
import Button from "../../../components/shared/Button";

const INITIAL_PASSWORDS = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const SecuritySettings = ({ onChangePassword }) => {
  const [passwords, setPasswords] = useState(INITIAL_PASSWORDS);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    onChangePassword?.(passwords);
    setPasswords(INITIAL_PASSWORDS);
  };

  return (
    <article className="rounded-2xl border color-border bg-white p-6">
      {/* Header */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Security Settings
        </h2>

        <p className="mt-1 text-sm text-secondary">
          Change your password to keep your account secure.
        </p>
      </section>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <section>
          <Input
            label="Current Password *"
            name="currentPassword"
            type={showCurrent ? "text" : "password"}
            value={passwords.currentPassword}
            onChange={handleChange}
            placeholder="Enter current password"
            isEyeButton
            showConfirm={showCurrent}
            setShowConfirm={setShowCurrent}
            required
          />
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="New Password *"
            name="newPassword"
            type={showNew ? "text" : "password"}
            value={passwords.newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
            isEyeButton
            showConfirm={showNew}
            setShowConfirm={setShowNew}
            required
          />

          <Input
            label="Confirm New Password *"
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            value={passwords.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter new password"
            isEyeButton
            showConfirm={showConfirm}
            setShowConfirm={setShowConfirm}
            required
          />
        </section>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <section className="flex justify-end pt-2">
          <Button type="submit" className="px-6! py-2.5!">
            Update Password
          </Button>
        </section>
      </form>
    </article>
  );
};

export default SecuritySettings;
