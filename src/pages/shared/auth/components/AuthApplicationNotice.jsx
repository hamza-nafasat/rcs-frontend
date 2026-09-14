import { FileText, X } from "lucide-react";

const AuthApplicationNotice = ({ onDismiss }) => {
  return (
    <aside className="flex items-center gap-3 rounded-xl bg-moderator px-3 py-2.5">
      <FileText size={18} className="shrink-0 text-primary" />

      <p className="min-w-0 flex-1 text-sm">
        <span className="font-semibold text-tertiary">New Client Application</span>{" "}
        <span className="text-secondary">
          Complete all sections — scores calculate automatically
        </span>
      </p>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss application notice"
          className="shrink-0 rounded-md p-1 text-secondary hover:bg-white/60"
        >
          <X size={16} />
        </button>
      )}
    </aside>
  );
};

export default AuthApplicationNotice;
