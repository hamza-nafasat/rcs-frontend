// a failed check reads red
const valueClass = (ok) => {
  if (ok === true) return "text-revenue";
  if (ok === false) return "text-remove";
  return "text-tertiary";
};

const ScorecardSection = ({ icon: Icon, title, items = [], className = "" }) => {
  return (
    <section className={`rounded-xl border color-border bg-white p-4 ${className}`}>
      <h3 className="flex items-center gap-2 text-sm font-semibold text-tertiary">
        {Icon && <Icon size={16} className="text-muted" />}
        {title}
      </h3>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {items.map((item) => (
          <div key={item.label} className="rounded-lg bg-active p-3 text-center">
            <p className={`text-sm font-semibold ${valueClass(item.ok)}`}>{item.value}</p>

            <p className="mt-1 text-[11px] text-secondary">{item.label}</p>

            {item.hint && (
              <p className={`mt-1 text-[10px] ${item.ok ? "text-revenue" : "text-remove"}`}>
                {item.ok ? "✓" : "✘"} {item.hint}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ScorecardSection;
