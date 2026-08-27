const SegmentedControl = ({
  label,
  value,
  onChange,
  options = [],
  hint,
  hintClassName = "",
  className = "",
  labelClassName = "uppercase tracking-wide",
}) => {
  return (
    <section className={`w-full ${className}`}>
      {label && (
        <label
          className={`mb-1 block text-xs font-semibold text-tertiary ${labelClassName}`}
        >
          {label}
        </label>
      )}

      <div className="flex overflow-hidden rounded-lg border color-border">
        {options.map((option, index) => {
          const isActive = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`flex-1 px-3 py-2 text-sm font-semibold transition ${
                index > 0 ? "border-l color-border" : ""
              } ${
                isActive
                  ? option.activeClassName
                  : "bg-white text-secondary hover:bg-muted"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {hint && (
        <p className={`mt-1 text-xs text-muted ${hintClassName}`}>{hint}</p>
      )}
    </section>
  );
};

export default SegmentedControl;
