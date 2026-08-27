import { ArrowUpRight } from "lucide-react";

const StatsCard = ({ icon, badge, value, label, comparison }) => {
  return (
    <article className="h-full rounded-2xl bg-white p-5 border color-border transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md">
      {/* Top */}
      <section className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center">
          {icon && <img src={icon} alt="" />}
        </div>

        {badge && (
          <span className="rounded-full bg-revenue px-2.5 py-1 text-xs font-medium text-revenue">
            <ArrowUpRight size={12} className="mr-1 inline-block" />
            {badge}
          </span>
        )}
      </section>

      {/* Figure */}
      <section className="mt-5">
        <h3 className="text-xl font-semibold text-gray-900">{value}</h3>
        <p className="mt-1 text-xs sm:text-sm text-gray-500">{label}</p>
      </section>

      {/* Comparison */}
      {comparison && <p className="mt-4 text-xs text-gray-500">{comparison}</p>}
    </article>
  );
};

export default StatsCard;
