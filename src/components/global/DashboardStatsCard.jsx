import { ArrowUpRight } from "lucide-react";

const DEFAULT_TILE = { color: "var(--color-text-secondary)", bg: "var(--color-bg-muted)" };

const DashboardStatsCard = ({ icon: Icon, iconTile = DEFAULT_TILE, value, label, comparison }) => {
  // an svg path or component
  const isImage = typeof Icon === "string";

  return (
    <article className="h-full rounded-2xl border color-border bg-white p-5 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md">
      {/* Top */}
      <div className="flex items-center justify-between">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={isImage ? undefined : { backgroundColor: iconTile.bg }}
        >
          {isImage ? <img src={Icon} alt="" /> : Icon && <Icon size={20} style={{ color: iconTile.color }} />}
        </div>

        <ArrowUpRight size={14} className="mr-1 inline-block icon-arrow" />
      </div>

      {/* Figure */}
      <div className="mt-5">
        <h3 className="text-xl font-semibold text-tertiary">{value}</h3>
        <p className="mt-1 text-xs text-secondary sm:text-sm">{label}</p>
      </div>

      {/* Comparison */}
      {comparison && <p className="mt-4 text-xs text-secondary">{comparison}</p>}
    </article>
  );
};

export default DashboardStatsCard;
