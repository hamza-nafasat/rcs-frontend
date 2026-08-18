import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const formatLabel = (segment) =>
  segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const Breadcrumb = () => {
  const { pathname } = useLocation();

  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1 text-sm text-tertiary">
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const path = "/" + segments.slice(0, index + 1).join("/");

          return (
            <li key={path} className="flex items-center gap-1">
              {index > 0 && <ChevronRight className="h-3 w-3 text-gray-400" />}

              {isLast ? (
                <span className="font-medium text-tertiary">
                  {formatLabel(segment)}
                </span>
              ) : (
                <Link to={path} className="hover:text-gray-700">
                  {formatLabel(segment)}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
