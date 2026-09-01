const ScorecardSection = ({ icon: Icon, title, items }) => {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
        {Icon && <Icon size={16} className="text-gray-400" />}
        {title}
      </h3>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-center"
          >
            <p className="text-xs text-gray-500">{item.label}</p>

            <p className="mt-1 text-sm font-semibold text-gray-900">
              {item.value}
            </p>

            {item.hint && (
              <p
                className={`mt-1 text-[10px] ${item.ok ? "text-green-600" : "text-red-600"}`}
              >
                {item.ok ? "✓" : "✕"} {item.hint}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ScorecardSection;
