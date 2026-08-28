import { useState } from "react";
import ReportHeading from "./components/ReportHeading";
import DetailedReport from "./components/DetailedReport";
import { recentApplicants } from "../dashboard/data/recentApplicants";

const toISODate = (submitted) => {
  const [month, day, year] = submitted.split("/");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

const Report = () => {
  const [dates, setDates] = useState({ startDate: "", endDate: "" });

  const handleDateChange = (event) => {
    const { name, value } = event.target;
    setDates((current) => ({ ...current, [name]: value }));
  };

  const applicants = recentApplicants.filter((row) => {
    const submitted = toISODate(row.submitted);
    if (dates.startDate && submitted < dates.startDate) return false;
    if (dates.endDate && submitted > dates.endDate) return false;
    return true;
  });

  return (
    <article className="flex flex-col gap-6">
      <ReportHeading
        heading="Pipeline Report"
        subheading="Marco · Generated August 4, 2026"
        dates={dates}
        onDateChange={handleDateChange}
      />

      <DetailedReport applicants={applicants} />
    </article>
  );
};

export default Report;
