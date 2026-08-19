const Button = ({
  children,
  icon,
  iconPosition = "left",
  className = "",
  type = "button",
  textClassName = "",
  ...props
}) => {
  return (
    <button
      className={`inline-flex items-center justify-center py-4 gap-2 rounded-xl cursor-pointer ${className} ${type != "icon" && "bg-(--color-primary) text-white py-4"}`}
      {...props}
      type={type}
    >
      {icon && iconPosition === "left" && icon}

      <span className={textClassName}>{children}</span>

      {icon && iconPosition === "right" && icon}
    </button>
  );
};

export default Button;
