import { useEffect, useRef } from "react";
import { Chart, DoughnutController, ArcElement, Tooltip } from "chart.js";
import Skeleton from "../shared/Skeleton";

Chart.register(DoughnutController, ArcElement, Tooltip);

const DashboardDonutChart = ({ labels, data, colors , isLoading = false }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext("2d");

    chartInstance.current = new Chart(ctx, {
      type: "doughnut",

      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: colors,
            borderWidth: 0,
            spacing: 8,
          },
        ],
      },

      options: {
        responsive: true,

        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });

    return () => {
      chartInstance.current?.destroy();
    };
  }, [labels, data, colors, isLoading]);

  if (isLoading)
    return (
      <section role="status" aria-label="Loading chart" className="flex flex-col items-center py-4">
        <Skeleton className="aspect-square w-full max-w-60 rounded-full" />

        <div className="mt-5 flex justify-center gap-4">
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} className="h-3 w-16" />
          ))}
        </div>
      </section>
    );

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className="w-full max-w-60">
        <canvas ref={chartRef} />
      </div>

      {/* Custom Legend */}
      <div className="mt-5 flex justify-center gap-4">
        {labels.map((label, index) => (
          <div
            key={label}
            className="flex items-center justify-center gap-2 lg:justify-start"
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{
                backgroundColor: colors[index],
              }}
            />

            <span className="text-sm text-secondary">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardDonutChart;