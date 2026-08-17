const Card = ({ children, header, className = "" }) => {
  return (
    <div
      className={`rounded-2xl bg-white p-5 border border-gray-200 ${className}`}
    >
      {header && <div className="mb-5">{header}</div>}

      {children}
    </div>
  );
};

export default Card;
