const Badge = ({ text, className = "" }) => {
  return (
    <div
      className={`inline-flex items-center rounded-full border px-3 py-1 bg-primary border-primary ${className}`}
    >
      <span className="primary text-xs">{text}</span>
    </div>
  );
};

export default Badge;
