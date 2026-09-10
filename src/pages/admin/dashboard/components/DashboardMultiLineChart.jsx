import { useEffect, useRef } from "react";
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

const DashboardMultiLineChart = ({ labels, datasets }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
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
  }, [labels, datasets]);

  return (
    <div className="min-h-56 w-full flex-1 sm:min-h-64 lg:min-h-72">
      <canvas ref={chartRef} />
    </div>
  );
};

export default DashboardMultiLineChart;
