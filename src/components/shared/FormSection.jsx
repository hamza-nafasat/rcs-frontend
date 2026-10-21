import { useEffect, useState } from "react";
import { Info, X } from "lucide-react";

// the long explanation lives behind the icon
const SectionInfoModal = ({ title, info, onClose }) => {
  // escape closes it like any overlay
  useEffect(() => {
    const onKeyDown = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <article className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <header className="flex shrink-0 items-center justify-between gap-4 border-b color-border px-5 py-4">
          <h3 className="min-w-0 truncate text-base font-semibold text-tertiary">{title}</h3>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 cursor-pointer rounded-full p-1.5 text-secondary transition hover:bg-gray-100"
          >
            <X size={16} />
          </button>
        </header>

        <div className="overflow-y-auto px-5 py-4">
          <p className="text-sm leading-relaxed text-secondary">{info.summary}</p>

          {info.points?.length > 0 && (
            <dl className="mt-4 flex flex-col gap-3.5">
              {info.points.map(({ label, text }) => (
                <div key={label}>
                  <dt className="text-sm font-semibold text-tertiary">{label}</dt>
                  <dd className="mt-0.5 text-sm leading-relaxed text-secondary">{text}</dd>
                </div>
              ))}
            </dl>
          )}

          {info.footnote && (
            <p className="mt-4 rounded-lg bg-active px-3.5 py-3 text-xs leading-relaxed text-secondary">
              {info.footnote}
            </p>
          )}
        </div>

        <footer className="shrink-0 border-t color-border px-5 py-3.5 text-right">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-xl bg-(--color-primary) px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Close
          </button>
        </footer>
      </article>
    </div>
  );
};

const FormSection = ({ icon: Icon, iconClassName = "", title, description, info, children }) => {
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  return (
    <section className="h-full rounded-xl border color-border bg-white p-4 sm:p-5">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-tertiary">
            {Icon && <Icon size={16} className={iconClassName} />}
            {title}
          </h2>

          {description && <p className="mt-1 text-xs leading-relaxed text-secondary">{description}</p>}
        </div>

        {info && (
          <button
            type="button"
            onClick={() => setIsInfoOpen(true)}
            title="Why we ask for this"
            aria-label={`Why we ask for ${title}`}
            className="shrink-0 cursor-pointer rounded-full p-1.5 text-muted transition hover:bg-moderator hover:text-primary"
          >
            <Info size={16} />
          </button>
        )}
      </header>

      {children}

      {isInfoOpen && <SectionInfoModal title={title} info={info} onClose={() => setIsInfoOpen(false)} />}
    </section>
  );
};

export default FormSection;
