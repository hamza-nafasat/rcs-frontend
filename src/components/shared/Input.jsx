const Input = ({
  label,
  type = "text",
  placeholder = "",
  icon,
  className = "",
  ...rest
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-[#111111]">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          className={`h-10 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 pr-10 text-sm outline-none focus:border-primary ${className}`}
          {...rest}
        />

        {icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary ">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;
