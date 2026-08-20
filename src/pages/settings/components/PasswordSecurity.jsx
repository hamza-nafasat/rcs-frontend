import { useState } from "react";
import Input from "../../../components/shared/Input";
import Button from "../../../components/shared/Button";
import CardHeading from "./CardHeading";
import {
  EMPTY_PASSWORDS,
  FIELD_LABEL_CLASS,
  MIN_PASSWORD_LENGTH,
} from "../constants";

const FIELDS = [
  {
    name: "currentPassword",
    label: "Current Password",
    placeholder: "Enter current password",
  },
  {
    name: "newPassword",
    label: "New Password",
    placeholder: `Min. ${MIN_PASSWORD_LENGTH} characters`,
  },
  {
    name: "confirmPassword",
    label: "Confirm New Password",
    placeholder: "Repeat new password",
  },
];

const PasswordSecurity = ({ onUpdatePassword }) => {
  const [passwords, setPasswords] = useState(EMPTY_PASSWORDS);
  const [visible, setVisible] = useState({});
  const [error, setError] = useState("");

  const { currentPassword, newPassword, confirmPassword } = passwords;

  const isValid =
    currentPassword.length > 0 &&
    newPassword.length >= MIN_PASSWORD_LENGTH &&
    confirmPassword.length > 0;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPasswords((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const toggleVisible = (name) =>
    setVisible((prev) => ({ ...prev, [name]: !prev[name] }));

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    onUpdatePassword?.(passwords);
    setPasswords(EMPTY_PASSWORDS);
  };

  return (
    <article className="rounded-2xl border color-border bg-white p-5">
      <CardHeading
        heading="Password & Security"
        subheading="Change your login password"
      />

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        {FIELDS.map(({ name, label, placeholder }) => (
          <Input
            key={name}
            name={name}
            label={label}
            placeholder={placeholder}
            type={visible[name] ? "text" : "password"}
            value={passwords[name]}
            onChange={handleChange}
            labelClassName={FIELD_LABEL_CLASS}
            isEyeButton
            showConfirm={!!visible[name]}
            setShowConfirm={() => toggleVisible(name)}
            required
          />
        ))}

        {error && <p className="text-sm text-remove">{error}</p>}

        <footer className="flex items-center justify-between gap-4 border-t color-border pt-4">
          <p className="text-xs text-muted">
            Use at least {MIN_PASSWORD_LENGTH} characters
          </p>

          <Button
            type="submit"
            disabled={!isValid}
            className={`px-5! py-2.5! text-sm ${isValid ? "" : "opacity-60"}`}
          >
            Update Password
          </Button>
        </footer>
      </form>
    </article>
  );
};

export default PasswordSecurity;
