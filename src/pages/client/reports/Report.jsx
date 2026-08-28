import { useState } from "react";
import ReportHeading from "./components/ReportHeading";
import DetailedReport from "./components/DetailedReport";
import { recentApplicants } from "../dashboard/data/recentApplicants";
import Card from "../../../components/shared/Card";

const toISODate = (submitted) => {
  const [month, day, year] = submitted.split("/");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

const cardData = [
  {
    label: "Total Clients",
    value: "8",
    valueColor: "#2563EB",
  },
  {
    label: "Total Messages",
    value: "2",
    valueColor: "#22C55E",
  },
  {
    label: "Total Leads",
    value: "7",
    valueColor: "#EF4444",
  },
  {
    label: "Converted Leads",
    value: "6",
    valueColor: "#F59E0B",
  },
];

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

<section className="mt-6 gap-4 grid grid-cols-2 lg:grid-cols-4">
        {cardData.map((card, index) => (
          <Card key={index} className="h-full">
            <div className="flex flex-col gap-1">
              <h2
                className="text-lg font-semibold"
                style={{ color: card.valueColor }}
              >
                {card.value}
              </h2>
              <p className="text-xs sm:text-sm font-medium text-muted">
                {card.label}
              </p>
            </div>
          </Card>
        ))}
      </section>

      <DetailedReport applicants={applicants} />
    </article>
  );
};

export default Report;
