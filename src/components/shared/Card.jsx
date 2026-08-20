const Card = ({ children, header, className = "" }) => {
  return (
    <div
      className={`rounded-2xl bg-white p-5 border color-border ${className}`}
    >
      {header && <div className="mb-5">{header}</div>}

      {children}
    </div>
  );
};

export default Card;
