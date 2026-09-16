import { LoaderCircle } from "lucide-react";

const BASE =
  "inline-flex items-center justify-center py-4 gap-2 rounded-xl cursor-pointer";

// no clicks, and it fades
const INACTIVE_CLASSES = "pointer-events-none opacity-60";

// appearance only, type stays html
const VARIANT_CLASSES = {
  primary: "bg-(--color-primary) text-white",
  bare: "",
  menuTrigger: "w-full py-2! px-3!",
  menuItem: "w-full py-0! px-0!",
  menuItemDanger: "w-full py-0! px-0! border-t border-gray-300 rounded-none!",
};

// padding inside keeps rows clickable
const VARIANT_TEXT_CLASSES = {
  menuTrigger:
    "flex w-full h-full gap-2 text-sm text-gray-700 transition hover:bg-gray-100",
  menuItem:
    "flex w-full px-3 py-2 h-full gap-2 text-sm text-gray-700 transition hover:bg-gray-100",
  menuItemDanger:
    "flex w-full px-3 py-2 h-full gap-2 text-left text-sm text-red-600 transition hover:bg-red-50",
};

const Button = ({
  children,
  icon,
  iconPosition = "left",
  variant = "primary",
  className = "",
  type = "button",
  textClassName = "",
  isLoading = false,
  isDisabled = false,
  ...props
}) => {
  const isInactive = isLoading || isDisabled;

  return (
    <button
      className={`${BASE} ${className} ${VARIANT_CLASSES[variant] ?? ""} ${isInactive ? INACTIVE_CLASSES : ""}`}
      {...props}
      type={type}
      disabled={isInactive}
      aria-busy={isLoading}
    >
      {isLoading && <LoaderCircle size={16} className="shrink-0 motion-safe:animate-spin" />}

      {icon && iconPosition === "left" && !isLoading && icon}

      <span className={`${VARIANT_TEXT_CLASSES[variant] ?? ""} ${textClassName}`}>
        {children}
      </span>

      {icon && iconPosition === "right" && icon}
    </button>
  );
};

export default Button;
