const Select = ({
  label,
  placeholder = "Select an option",
  options = [],
  className = "",
  ...rest
}) => {
  return (
    <section className="w-full">
      {label && (
        <label className="mb-1 block text-sm font-medium text-[#111111]">
          {label}
        </label>
      )}

      <select
        className={`h-10 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 text-sm outline-none focus:border-primary ${className}`}
        {...rest}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => {
          const value = typeof option === "string" ? option : option.value;
          const text = typeof option === "string" ? option : option.label;

          return (
            <option key={value} value={value}>
              {text}
            </option>
          );
        })}
      </select>
    </section>
  );
};

export default Select;
