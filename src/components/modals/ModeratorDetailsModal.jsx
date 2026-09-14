import { Mail, Phone, MapPin, Shield, CalendarDays, X } from "lucide-react";
import Avatar from "../shared/Avatar";
import Button from "../shared/Button";

const STATUS_STYLES = {
  Active: { pill: "bg-green-50 text-green-700", dot: "bg-green-500" },
  Inactive: { pill: "bg-gray-100 text-gray-600", dot: "bg-gray-400" },
};

const ModeratorDetailsModal = ({ isOpen, onClose, member, onEdit, onRemove }) => {
  if (!isOpen || !member) return null;

  const { pill, dot } = STATUS_STYLES[member.status] ?? STATUS_STYLES.Inactive;

  const details = [
    { icon: Mail, label: "Email", value: member.email },
    { icon: Phone, label: "Phone", value: member.phone || undefined },
    { icon: MapPin, label: "Location", value: [member.city, member.state].filter(Boolean).join(", ") || undefined },
    { icon: Shield, label: "Role", value: member.role },
    { icon: CalendarDays, label: "Joined", value: member.joined },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-110 overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <header className="mb-6 flex items-start justify-between gap-4">
          <section className="flex min-w-0 items-center gap-3">
            <Avatar name={member.fullName} src={member.src} size={48} rounded="rounded-xl" />

            <div className="min-w-0">
              <h2 className="truncate text-xl font-semibold text-tertiary">
                {member.fullName}
              </h2>

              <span
                className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${pill}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                {member.status}
              </span>
            </div>
          </section>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="shrink-0 rounded-full p-1 text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </header>

        <section className="flex flex-col gap-3">
          {details.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border color-border bg-muted">
                <Icon size={16} className="text-secondary" />
              </span>

              <div className="min-w-0">
                <p className="text-xs text-muted">{label}</p>
                <p className="truncate text-sm text-tertiary">{value ?? "—"}</p>
              </div>
            </div>
          ))}
        </section>

        <footer className="mt-6 flex gap-3">
          <Button
            type="button"
            variant="bare"
            onClick={() => onRemove?.(member)}
            className="w-1/2 rounded-xl border border-cancel bg-white text-remove px-3! py-2! hover:bg-red-50"
          >
            Remove
          </Button>

          <Button
            type="button"
            onClick={() => onEdit?.(member)}
            className="w-1/2 px-3! py-2!"
          >
            Edit
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default ModeratorDetailsModal;
