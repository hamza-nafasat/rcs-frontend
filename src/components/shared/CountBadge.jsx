const MAX_COUNT = 99;

const CountBadge = ({ count = 0, className = "" }) => {
  if (!count) return null;

  return (
    <span
      className={`flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium leading-none text-white ${className}`}
    >
      {count > MAX_COUNT ? `${MAX_COUNT}+` : count}
    </span>
  );
};

export default CountBadge;
