import { Eye, EyeOff } from "lucide-react";

const Input = ({
  label,
  type = "text",
  placeholder = "",
  icon,
  iconPosition = "right",
  className = "",
  labelClassName = "",
  isEyeButton = false,
  showConfirm = false,
  setShowConfirm,
  hint,
  hintClassName = "",
  ...rest
}) => {
  return (
    <section className="w-full">
      {label && (
        <label
          className={`mb-1 block text-sm font-medium text-[#111111] ${labelClassName}`}
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          className={`h-10 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 text-sm outline-none focus:border-primary ${
            icon && iconPosition === "left" ? "pl-10" : "pr-10"
          } ${className}`}
          {...rest}
        />

        {icon && (
          <div
            className={`absolute top-1/2 -translate-y-1/2 text-secondary ${
              iconPosition === "left" ? "left-3" : "right-3"
            }`}
          >
            {icon}
          </div>
        )}
        {isEyeButton && (
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary"
          >
            {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
      </div>

      {hint && (
        <p className={`mt-1 text-xs text-muted ${hintClassName}`}>{hint}</p>
      )}
    </section>
  );
};

export default Input;
