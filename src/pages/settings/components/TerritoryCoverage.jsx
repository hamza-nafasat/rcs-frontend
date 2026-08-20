import { MapPin } from "lucide-react";
import CardHeading from "./CardHeading";

const TerritoryCoverage = ({ territories = [] }) => {
  return (
    <article className="rounded-2xl border color-border bg-white p-5">
      <CardHeading
        heading="Territory Coverage"
        subheading="Markets where your franchise opportunities are open"
      />

      <ul className="mt-5 flex flex-wrap gap-2">
        {territories.map((territory) => (
          <li
            key={territory}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700"
          >
            <MapPin size={12} />
            {territory}
          </li>
        ))}
      </ul>

      <p className="mt-4 text-xs text-muted">
        To add or change territories, contact your RCS consultant.
      </p>
    </article>
  );
};

export default TerritoryCoverage;
