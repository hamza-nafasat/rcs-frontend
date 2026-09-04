import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const formatLabel = (segment) =>
  segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const IGNORED_SEGMENTS = new Set(["admin", "client", "user"]);

const Breadcrumb = () => {
  const { pathname } = useLocation();

  const allSegments = pathname.split("/").filter(Boolean);

  const breadcrumbItems = allSegments
    .map((segment, index) => ({
      segment,
      path: "/" + allSegments.slice(0, index + 1).join("/"),
    }))
    .filter((item) => !IGNORED_SEGMENTS.has(item.segment.toLowerCase()));

  if (breadcrumbItems.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1 text-sm text-tertiary">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <li key={item.path} className="flex items-center gap-1">
              {index > 0 && <ChevronRight className="h-3 w-3 text-gray-400" />}

              {isLast ? (
                <span className="font-medium text-tertiary">
                  {formatLabel(item.segment)}
                </span>
              ) : (
                <Link to={item.path} className="hover:text-gray-700">
                  {formatLabel(item.segment)}
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

