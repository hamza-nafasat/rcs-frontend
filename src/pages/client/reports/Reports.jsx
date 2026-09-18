import { useState } from "react";
import ReportHeading from "./components/ReportHeading";
import DetailedReport from "./components/DetailedReport";
import DashboardStatsCard from "../../../components/global/DashboardStatsCard";
import { useAuthUser } from "../../../routes/useAuthUser";
import { useGetReportQuery } from "../../../store/apis/client/report.apis";
import { statCards } from "./utils/data";

// only send the chosen dates
const toParams = ({ startDate, endDate }) => ({
  ...(startDate && { startDate }),
  ...(endDate && { endDate }),
});

const Reports = () => {
  const [dates, setDates] = useState({ startDate: "", endDate: "" });
  const { user } = useAuthUser();
  const { data, isFetching } = useGetReportQuery(toParams(dates), {
    refetchOnMountOrArgChange: true,
  });
  const report = data?.data;
  const generatedOn = new Date().toLocaleDateString([], {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleDateChange = (event) => {
    const { name, value } = event.target;
    setDates((current) => ({ ...current, [name]: value }));
  };

  const rangeLabel =
    dates.startDate || dates.endDate ? "In selected dates" : "All time";

  return (
    <article className="flex flex-col gap-6">
      <ReportHeading
        heading="Pipeline Report"
        subheading={[user?.fullName, `Generated ${generatedOn}`]
          .filter(Boolean)
          .join(" · ")}
        dates={dates}
        onDateChange={handleDateChange}
      />

      <section className="grid grid-cols-1 gap-4 sm:mt-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ metric, ...card }) => (
          <DashboardStatsCard
            key={metric}
            {...card}
            value={report ? report.totals[metric].toLocaleString() : "—"}
            comparison={rangeLabel}
          />
        ))}
      </section>

      <DetailedReport
        applicants={report?.applications ?? []}
        isLoading={isFetching}
      />
    </article>
  );
};

export default Reports;
