import { useEffect, useRef } from "react";

import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

const UserBarChart = ({ data = [], labels = [] }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    chartInstance.current = new Chart(ctx, {
      type: "bar",

      data: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],

        datasets: [
          {
            data:
              data.length === 12
                ? data
                : [20, 35, 28, 50, 45, 70, 55, 65, 40, 75, 60, 80],
            labels:
              labels.length === 12
                ? labels
                : [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ],

            backgroundColor: "#F97316",
            borderRadius: 6,
          },
        ],
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
  }, [data, labels]);

  return (
    <div className="min-h-56 w-full flex-1 sm:min-h-64 lg:min-h-72">
      <canvas ref={chartRef} />
    </div>
  );
};

export default UserBarChart;
