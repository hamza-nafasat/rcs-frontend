const StatsCard = ({ icon, badge, value, label, comparison }) => {
  return (
    <article className="rounded-2xl bg-white p-5 shadow-sm">
      {/* Top */}
      <section className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
          {icon && <img src={icon} alt="" />}
        </div>

        {badge && (
          <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600">
            {badge}
          </span>
        )}
      </section>

      {/* Figure */}
      <section className="mt-5">
        <h3 className="text-2xl font-semibold text-gray-900">{value}</h3>
        <p className="mt-1 text-sm text-gray-500">{label}</p>
      </section>

      {/* Comparison */}
      {comparison && <p className="mt-4 text-xs text-gray-500">{comparison}</p>}
    </article>
  );
};

export default StatsCard;
