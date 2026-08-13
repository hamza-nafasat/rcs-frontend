const Button = ({ children, icon, iconPosition = "left", className = "" }) => {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 bg-(--color-primary) text-white py-4 rounded-xl cursor-pointer ${className}`}
    >
      {icon && iconPosition === "left" && icon}

      <span>{children}</span>

      {icon && iconPosition === "right" && icon}
    </button>
  );
};

export default Button;
