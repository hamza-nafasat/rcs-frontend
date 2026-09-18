import { useEffect, useRef } from "react";
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Legend, Tooltip } from "chart.js";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Legend, Tooltip);

const DashboardBarChart = ({ labels = [], datasets = [] }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: { labels, datasets: datasets.map((set) => ({ borderRadius: 6, ...set })) },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: datasets.length > 1, position: "bottom", labels: { usePointStyle: true, boxWidth: 8 } },
        },
        scales: { y: { beginAtZero: true } },
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

export default DashboardBarChart;
