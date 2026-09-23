import { useEffect, useRef } from "react";
import ChartSkeleton from "../../../../components/global/ChartSkeleton";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
);

const DashboardMultiLineChart = ({ labels, datasets , isLoading = false }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext("2d");

    chartInstance.current = new Chart(ctx, {
      type: "line",

      data: {
        labels,
        datasets,
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
          legend: {
            display: false,
          },
        },

        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      chartInstance.current?.destroy();
    };
  }, [labels, datasets, isLoading]);

  if (isLoading) return <ChartSkeleton />;

  return (
    <div className="min-h-56 w-full flex-1 sm:min-h-64 lg:min-h-72">
      <canvas ref={chartRef} />
    </div>
  );
};

export default DashboardMultiLineChart;
