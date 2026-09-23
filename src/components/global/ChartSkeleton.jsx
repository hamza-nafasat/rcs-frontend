import Skeleton from "../shared/Skeleton";

// bar heights that read as a chart
const BAR_HEIGHTS = ["h-1/3", "h-1/2", "h-2/5", "h-3/4", "h-3/5", "h-full", "h-1/2"];

const ChartSkeleton = () => (
  <section role="status" aria-label="Loading chart" className="min-h-56 w-full flex-1 sm:min-h-64 lg:min-h-72">
    <div className="flex h-56 items-end gap-3 px-2 sm:h-64 lg:h-72">
      {BAR_HEIGHTS.map((height, index) => (
        <Skeleton key={index} className={`w-full ${height}`} />
      ))}
    </div>

    <Skeleton className="mx-auto mt-4 h-3 w-32" />
  </section>
);

export default ChartSkeleton;
