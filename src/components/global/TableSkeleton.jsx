import Skeleton from "../shared/Skeleton";

// uneven widths read as real rows
const CELL_WIDTHS = ["w-2/5", "w-1/4", "w-1/3", "w-1/5", "w-1/4"];

const TableSkeleton = ({ rows = 6, columns = 5 }) => (
  <section role="status" aria-label="Loading" className="w-full divide-y color-border">
    {Array.from({ length: rows }, (_, row) => (
      <div key={row} className="flex items-center gap-4 px-5 py-4">
        {Array.from({ length: columns }, (_, column) => (
          <span key={column} className="flex-1">
            <Skeleton className={`h-3.5 ${CELL_WIDTHS[column % CELL_WIDTHS.length]}`} />
          </span>
        ))}
      </div>
    ))}
  </section>
);

export default TableSkeleton;
