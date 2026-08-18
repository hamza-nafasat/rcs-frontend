const Badge = ({ text, dotColor = "var(--color-primary)", className = "" }) => {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 bg-primary border-primary ${className}`}
    >
      {dotColor && (
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: dotColor }}
        />
      )}

      <span className="primary text-xs">{text}</span>
    </div>
  );
};

export default Badge;
