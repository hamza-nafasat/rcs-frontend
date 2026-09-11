import { ArrowUpRight } from "lucide-react";

const DashboardStatsCard = ({ icon, value, label, comparison }) => {
  return (
    <article className="h-full rounded-2xl bg-white p-5 border color-border transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md">
      {/* Top */}
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center">
          {icon && <img src={icon} alt="" />}
        </div>

        <ArrowUpRight size={14} className="mr-1 inline-block icon-arrow" />
      </div>

      {/* Figure */}
      <div className="mt-5">
        <h3 className="text-xl font-semibold text-gray-900">{value}</h3>
        <p className="mt-1 text-xs sm:text-sm text-gray-500">{label}</p>
      </div>

      {/* Comparison */}
      {comparison && <p className="mt-4 text-xs text-gray-500">{comparison}</p>}
    </article>
  );
};

export default DashboardStatsCard;
