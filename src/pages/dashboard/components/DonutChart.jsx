import { useEffect, useRef } from "react";
import { Chart, DoughnutController, ArcElement, Tooltip } from "chart.js";

Chart.register(DoughnutController, ArcElement, Tooltip);

const DonutChart = ({ labels, data, colors }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
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
  }, [labels, data, colors]);

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className="w-full max-w-60">
        <canvas ref={chartRef} />
      </div>

      {/* Custom Legend */}
      <div className="mt-5 flex flex-wrap justify-center gap-4 lg:gap-0 lg:grid lg:grid-flow-col lg:grid-cols-2 lg:grid-rows-[repeat(3,auto)]">
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

            <span className="text-sm text-gray-600">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
