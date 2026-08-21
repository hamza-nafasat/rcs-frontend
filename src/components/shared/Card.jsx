const Card = ({ children, header, className = "" }) => {
  return (
    <div
      className={`rounded-2xl bg-white p-5 border color-border transition-shadow duration-300 ease-out hover:shadow-md ${className}`}
    >
      {header && <div className="mb-5">{header}</div>}

      {children}
    </div>
  );
};

export default Card;
